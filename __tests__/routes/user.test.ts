import request from 'supertest'
import app from '../../src/app'

describe('POST /api/login', () => { 
    
    test('should login successful with default user', async () => { 
        const res = await request(app).post('/api/login').send({
            user: "player",
            password: "12345"
        });

        expect(res.body['token']).toBeDefined();
        expect(res.body['userid']).toBeDefined();
        expect(res.body['logged']).toBe(true);
     })

     test('should respond with a 401 status if credentials are incorrect', async () => { 
        const res = await request(app).post('/api/login').send({
            user: "*****",
            password: "*****"
        });

        expect(res.statusCode).toBe(401)
     })

     test('should respond with a 422 status if params are missing', async () => { 
        const res = await request(app).post('/api/login').send();
        expect(res.statusCode).toBe(422)
     })
     
 })