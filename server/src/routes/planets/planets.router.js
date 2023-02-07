const express = require('express')
const {
    httpGetAllPlanets,
} = require('./planets.controller')

const planetsRouter = express.Router()

planetsRouter.route('/').get(httpGetAllPlanets)

module.exports = planetsRouter