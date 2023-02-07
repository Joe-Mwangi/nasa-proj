const mongoose = require('mongoose')

function connectDB(url) {
    return mongoose.connect(url)
}

mongoose.connection.once('open', () => {
    console.log('Mongodb connection ready...')
})

mongoose.connection.on('error', (err) => {
    console.error(err)
})

module.exports = connectDB