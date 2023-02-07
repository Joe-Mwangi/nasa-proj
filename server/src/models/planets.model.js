const fs = require('fs');
const path = require('path')
const {parse} = require('csv-parse');
const Planet = require('./planets.mongo')


function isHabitablePlanet(planet) {
  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '..', '..', 'data','kepler-data.csv'))
    .pipe(parse({
      comment: '#',
      columns: true,
    }))
    .on('data', async (data) => {
      if (isHabitablePlanet(data)) {
        savePlanet(data)
      }
    })
    .on('error', (err) => {
      console.log(err);
      reject(err)
    })
    .on('end', async () => {
      Planet.countDocuments({}, (err, count) => {
        console.log(`${count} habitable planets found!`)
      })
      resolve()
     });
  })  
}

async function getAllPlanets() {
  return await Planet.find({}).select('keplerName -_id')
}
async function savePlanet(data) {
  try {
    await Planet.findOneAndUpdate({
      keplerName: data.kepler_name,
    },{
      keplerName: data.kepler_name
    }, {new: true ,upsert: true})
  } catch (error) {
    console.error(error)
  }
}

  module.exports = {
    loadPlanetsData,
    getAllPlanets
  }