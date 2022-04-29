//Additional package importation
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000
//middleware
app.use(cors())
app.use(express.json())
//Database Configuration
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@assingmentcluster.jo7ra.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//root directory of server and for checking my server
app.get('/', (req, res) => {
    res.send('Hello Assingment 11 :)')
})
app.listen(port, () => {
    console.log(`My node server running on port ${port}`)
})

async function run() {
    try {
        await client.connect();
    }
    finally {

    }
}
run().catch(console.dir)