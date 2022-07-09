import request from 'supertest'
import app from '../src/app'

describe("Server listening", () => {

    test("Ping/Pong response", async () => {
      const res = await request(app).get('/api/ping').send();
      expect(res.text).toBe('pong')
    });

  });