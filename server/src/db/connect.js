const mongoose = require('mongoose')

async function connectDB() {
    return await mongoose.connect("mongodb://localhost/nasa_proj")
}

mongoose.connection.once('open', () => {
    console.log('Mongodb connection ready...')
})

mongoose.connection.on('error', (err) => {
    console.error(err)
})

module.exports = connectDB