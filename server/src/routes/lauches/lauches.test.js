const request = require('supertest')
const app = require('../../app')

describe('Test GET /launches', () => {
    test('It should respond with 200 success', async () => {
        await request(app)
        .get('/launches')
        .expect(200)
        .expect('Content-Type', /json/)
    })
})

describe('Test POST /launches', () => {
    const completeLaunchData = {
        mission: 'NASA',
        rocket: 'NCC 494F',
        target: 'Kepler-e54',
        launchDate: 'January 4, 2024'
    }
    const LaunchDataWithoutDate = {
        mission: 'NASA',
        rocket: 'NCC 494F',
        target: 'Kepler-e54',
    }
    const launchDataWithInvalidDate = {
        mission: 'NASA',
        rocket: 'NCC 494F',
        target: 'Kepler-e54',
        launchDate: 'Hello'
    }

    test('It should respond with 201 success', async () => {
        const response = await request(app)
        .post('/launches')
        .send(completeLaunchData).expect('Content-Type', /json/).expect(201)

        const requestDate = new Date(completeLaunchData.launchDate).valueOf()
        const responseDate = new Date(response.body.launch.launchDate).valueOf()

        expect(responseDate).toBe(requestDate)
        // expect(response.body.launch).toMatchObject(LaunchDataWithoutDate)
        expect(response.body).toMatchObject({msg: 'Item has been created'})
    })
    test('It should catch missing required properties', async () => {
        const response = await request(app)
        .post('/launches')
        .send(LaunchDataWithoutDate).expect('Content-Type', /json/).expect(400)
        
        expect(response.body).toStrictEqual({
            msg: 'Missing required launch property'
        })
    })
    test('It should catch invalid dates', async () => {
        const response = await request(app)
        .post('/launches')
        .send(launchDataWithInvalidDate)
        .expect('Content-Type', /json/).expect(400)
        
        expect(response.body).toStrictEqual({
            msg: 'Invalid launch date'
        })
        
    })
})