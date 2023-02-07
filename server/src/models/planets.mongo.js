const mongoose = require('mongoose')

const PlanetsSchema = new mongoose.Schema({
    keplerName: {
        type: String,
        required: [true, 'Planets missing']
    }
})

module.exports = mongoose.model('Planet', PlanetsSchema)