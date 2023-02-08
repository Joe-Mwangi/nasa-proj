const Launch = require('./launches.mongo')
const Planet = require('./planets.mongo')
const {NotFoundError} = require('../errors')


const defaultFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Explara X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customer: ['JOE', 'NASA'],
  upcoming: true,
  success: true,
};


saveLaunch(launch)

async function existsLaunchWithId(launchId) {
  return await Launch.findOne({flightNumber: launchId})
}

async function getLatestFlightNo() {
  const latestLaunch = await Launch.findOne().sort('-flightNumber')
  if(!latestLaunch) {
    return defaultFlightNumber
  }
  return latestLaunch.flightNumber
}

async function getAllLauches() {
  return await Launch.find({}, {
    '_id': 0, '__v': 0
  })
}

async function saveLaunch(launch) {
  const planet = await Planet.findOne({
    keplerName: launch.target
  })
  if(!planet) {
    throw new NotFoundError('No matching planet found')
  }
  return await Launch.findOneAndUpdate({
    flightNumber: launch.flightNumber
  },launch,{
      upsert: true
    })
}

async function addNewLaunch(launch) {
  const latestFlightNumber = await getLatestFlightNo() +  1 
  const newLaunch = Object.assign(launch, {
    flightNumber: latestFlightNumber,
    success: true,
    upcoming: true,
    customers: ['STARLINK', 'NASA'],
  })
  await saveLaunch(newLaunch)
}

async function abortLaunchById(launchId) {
  const aborted = await Launch.updateOne({
    flightNumber: launchId,
  }, {upcoming: false, success: false},)
  return aborted.acknowledged && aborted.modifiedCount === 1
}

module.exports = {
  existsLaunchWithId,
  getAllLauches,
  addNewLaunch,
  abortLaunchById,
}