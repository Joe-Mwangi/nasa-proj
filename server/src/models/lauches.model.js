const axios = require('axios')
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

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query'

async function populateLaunches() {
  const response = await axios.post(SPACEX_API_URL,{
    query: {},
    options: {
      pagination: false,
        populate: [
            {
              path: 'rocket',
              select: {
                  name: 1
              }
            },
            {
              path: 'payloads',
              select: {
                  'customers': 1
              }
            },
        ]
    }
  })
  if(response.status !== 200) {
    throw new NotFoundError('Launches failed to download')
  }
  const launchDocs = response.data.docs
  for(let launchDoc of launchDocs) {
    const payloads = launchDoc['payloads']
    const customers = payloads.flatMap(payload => {
      return payload['customers']
    })

    const launch = {
      flightNumber: launchDoc['flight_number'],
      mission: launchDoc['name'],
      rocket: launchDoc['rocket']['name'],
      upcoming: launchDoc['upcoming'],
      success: launchDoc['success'],
      launchDate: launchDoc['date_local'],
      customers
    }
    console.log(`${launch.flightNumber} - ${launch.rocket} - ${launch.mission}`)
    await saveLaunch(launch)
  }
}

async function loadLaunchesData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat'
  })
  if(firstLaunch) {
    console.log('Launch data already loaded...')
  } else {
    await populateLaunches()
  }
}

async function findLaunch(filter) {
  return await Launch.findOne(filter)
}

async function existsLaunchWithId(launchId) {
  return await findLaunch({flightNumber: launchId})
}

async function getLatestFlightNo() {
  const latestLaunch = await Launch.findOne().sort('-flightNumber')
  if(!latestLaunch) {
    return defaultFlightNumber
  }
  return latestLaunch.flightNumber
}

async function getAllLauches(limit, skip) {
  return await Launch.find({}, {
    '_id': 0, '__v': 0
  }).limit(limit).skip(skip)
}

async function saveLaunch(launch) {
  return await Launch.findOneAndUpdate({
    flightNumber: launch.flightNumber
  },launch,{
      upsert: true
    })
}

async function addNewLaunch(launch) {
  const planet = await Planet.findOne({
    keplerName: launch.target
  })
  if(!planet) {
    throw new NotFoundError('No matching planet found')
  }
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
  loadLaunchesData,
}