const http = require('http')
const app = require('./app')
const {loadPlanetsData} = require('./models/planets.model') 
const connectDB = require('./db/connect')

const server = http.createServer(app)
  
const port = process.env.PORT || 8000


 startServer()


async function startServer() {
    await loadPlanetsData()
    await connectDB()
    server.listen(port, () => 
        console.log(`Server listening on port: ${port}...`))
}