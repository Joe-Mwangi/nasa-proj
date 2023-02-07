const Launch = require('./launches.mongo')
const Planet = require('./planets.mongo')
const {NotFoundError} = require('../errors')

const launches = new Map();

let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Explara X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customer: ["JOE", "NASA"],
  upcoming: true,
  success: true,
};

// launches.set(launch.flightNumber, launch);

saveLaunch(launch)

function existsLaunchWithId(launchId) {
  return launches.has(launchId)
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
  return await Launch.updateOne({
    flightNumber: launch.flightNumber
  },launch,{
      upsert: true
    })
}

function addNewLaunch(launch) {
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      flightNumber: latestFlightNumber,
      success: true,
      upcoming: true,
      customers: ["STARLINK", "NASA"],
    })
  );
}

function abortLaunchById(launchId) {
  const aborted = launches.get(launchId)
  aborted.upcoming = false
  aborted.success = false
  return aborted
}

module.exports = {
  existsLaunchWithId,
  getAllLauches,
  addNewLaunch,
  abortLaunchById,
}