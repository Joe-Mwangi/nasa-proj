require('express-async-errors')
const express = require('express')
const path = require('path')
const cors = require('cors')
const morgan = require('morgan')
const api = require('./routes/api')
const errorHandler = require('./middleware/errorHandler')


const app = express()

app.use(cors({
    origin: 'http://localhost:3000'
}))
app.use(morgan('dev'))
app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')))
app.use(errorHandler)
app.use('/v1', api)

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})
 
module.exports = app