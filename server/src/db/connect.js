const mongoose = require('mongoose')

mongoose.connection.once('open', () => {
    console.log('Mongodb connection ready...')
})

mongoose.connection.on('error', (err) => {
    console.error(err)
})

async function connectDB() {
    return await mongoose.connect("mongodb://localhost/nasa_proj")
}

async function disconnectDB() {
    return await mongoose.disconnect()
}

module.exports = {
    connectDB,
    disconnectDB
}