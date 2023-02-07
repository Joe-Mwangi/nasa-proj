const mongoose = require('mongoose')


const LaunchesSchema = new mongoose.Schema({
  flightNumber: {
    type: Number,
    required: [true, 'flight number is missing']
  },
  mission: {
    type: String,
    required: [true, 'Mission name missing']
  },
  success: {
    type: Boolean,
    required: [true, 'Success missing'],
    default: true
  },
  upcoming: {
    type: Boolean,
    required: [true, 'upcoming missing']
  },
  customer: {
    type: [String],
    required: [true, 'Customer details missing']
  },
  target: {
    type: String,
    required: [true, 'target missing']
  },
  launchDate: {
    type: Date,
    required: [true, 'LaunchDate missing']
  },
  rocket: {
    type: String,
    required: [true, 'Rocket name missing']
  }
})

module.exports = mongoose.model('Launch', LaunchesSchema)
