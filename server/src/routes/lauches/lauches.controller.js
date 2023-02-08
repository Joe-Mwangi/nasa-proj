const { 
    getAllLauches, 
    addNewLaunch ,
    abortLaunchById,
    existsLaunchWithId,
} = require('../../models/lauches.model')

const httpGetAllLauches = async (req, res) => {
    return res.status(200).json(await getAllLauches()) 
}

const httpAddNewLaunch = async (req, res) => {
    const launch = req.body

    if(!launch.mission || !launch.launchDate 
        || !launch.target || !launch.rocket ) {
        return res.status(400).json({msg: 'Missing required launch property'}) 
    }

    launch.launchDate = new Date(launch.launchDate)
    if(isNaN(launch.launchDate)) {
        return res.status(400).json({msg: 'Invalid launch date'})
    }
    await addNewLaunch(launch)
    return res.status(201).json({launch, msg: 'Item has been created'})
}

const httpAbortLaunch = async (req, res) => {
    const launchId = +req.params.id
    const exists = await existsLaunchWithId(launchId)
    if(!exists) {
        return res.status(404).json({msg: 'Launch does not exist'})
    }
    const aborted = await abortLaunchById(launchId)
    if(!aborted) {
        return res.status(400).json({msg: 'Launch not aborted'})
    }
    return res.status(200).json({ok: true})
}

module.exports = {
    httpGetAllLauches,
    httpAddNewLaunch,
    httpAbortLaunch,
}