//Additional package importation
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000
//middleware
app.use(cors())
app.use(express.json())
//root directory of server and for checking my server
app.get('/', (req, res) => {
    res.send('Hello Assingment 11 :)')
})
app.listen(port, () => {
    console.log(`My node server running on port ${port}`)
})
