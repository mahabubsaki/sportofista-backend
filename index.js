//Additional package importation
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const jwt = require('jsonwebtoken')
const port = process.env.PORT || 5000
//middleware
app.use(cors())
app.use(express.json())
//Database Configuration
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@assingmentcluster.jo7ra.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//root directory of server and for checking my server
app.get('/', (req, res) => {
    res.send('Hello Assingment 11 :)')
})
app.listen(port, () => {
    console.log(`My node server running on port ${port}`)
})
const tokenVerify = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.status(401).send({ message: 'Unauthorized Access' })
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'Forbidden Access' })
        }
        req.decoded = decoded
        next()
    })
}
async function run() {
    try {
        await client.connect();
        const warehouseCollection = await client.db('warehouse').collection('products')
        app.get('/products', async (req, res) => {
            const query = {}
            const location = req.query.location
            if (location === 'home') {
                const cursor = warehouseCollection.find(query);
                const allProducts = await cursor.toArray()
                let maxProduct;
                if (allProducts.length <= 6) {
                    maxProduct = allProducts
                }
                else {
                    maxProduct = allProducts.slice(0, 6)
                }
                res.send(maxProduct)
            }
            else {
                const cursor = await warehouseCollection.find(query);
                const allProducts = await cursor.toArray()
                res.send(allProducts)
            }
        })
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const product = await warehouseCollection.findOne(query)
            if (product) {
                res.send(product)
            }
            else {
                res.send({ error: 'NotFound' })
            }
        })
        app.get('/myproducts', async (req, res) => {
            const email = req.query.email
            const query = { email: email }
            const cursor = await warehouseCollection.find(query)
            const myproducts = await cursor.toArray()
            res.send(myproducts)
        })
        app.put('/updateproduct', async (req, res) => {
            const { id, newQuantity } = req.query
            const query = { _id: ObjectId(id) }
            const selectedProduct = await warehouseCollection.findOne(query)
            const { name, img, description, price, quantity, supplier } = selectedProduct
            const updatedProduct = { quantity: parseInt(newQuantity), name, img, description, price, supplier }
            const options = { upsert: true };
            const updateDoc = {
                $set: updatedProduct
            };
            const result = await warehouseCollection.updateOne(query, updateDoc, options);
            res.send(result)
        })
        app.post('/addproduct', async (req, res) => {
            const newProduct = req.body
            const result = await warehouseCollection.insertOne(newProduct)
            res.send(result)
        })
        app.delete('/deleteproduct', async (req, res) => {
            const id = req.query.id
            const query = { _id: ObjectId(id) }
            const result = await warehouseCollection.deleteOne(query)
            res.send(result)
        })
        app.post('/enter', async (req, res) => {
            const user = req.body.email
            const accessToken = jwt.sign({ user: user }, process.env.ACCESS_TOKEN, { expiresIn: '24h' })
            res.send({ accessToken })
        })
        app.get('/user/:email', tokenVerify, async (req, res) => {
            const decodedEmail = req.decoded.email
            const email = req.params.email
            if (decodedEmail === email) {
                res.send({ message: 'success' })
            }
            else {
                return res.status(403).send({ message: 'Forbidden Access' })
            }
        })
    }
    finally {

    }
}
run().catch(console.dir)