const express = require('express')

const {
    httpGetAllLauches,
    httpAddNewLaunch,
    httpAbortLaunch
} = require('./lauches.controller')

const lauchesRouter = express.Router()

lauchesRouter.route('/').post(httpAddNewLaunch).get(httpGetAllLauches)
lauchesRouter.route('/:id').delete(httpAbortLaunch)

module.exports = lauchesRouter