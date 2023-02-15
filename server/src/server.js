const http = require('http')
require('dotenv').config()

const app = require('./app')
const {loadPlanetsData} = require('./models/planets.model') 
const {loadLaunchesData} = require('./models/lauches.model')
const {connectDB} = require('./db/connect')

const server = http.createServer(app)
  
const port = process.env.PORT || 8000


 startServer()


async function startServer() {
    await connectDB()
    await loadPlanetsData()
    await loadLaunchesData()
    server.listen(port, () => 
        console.log(`Server listening on port: ${port}...`))
}