import request from 'supertest'
import app from '../../src/app'

describe('GET /user/:userId/game', () => { 
    
    test('should respond with a 403 if token is not present/valid', async () => { 
        const res = await request(app).get('/get/1/game');

        
     })

     
 })