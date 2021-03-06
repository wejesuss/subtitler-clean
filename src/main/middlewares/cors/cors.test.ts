import request from 'supertest'
import app from '../../config/app'

describe('CORS Middleware', () => {
  test('Should enable CORS policy', async () => {
    app.get('/test-cors', (req, res) => res.send())

    await request(app)
      .get('/test-cors')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-headers', '*')
      .expect('access-control-allow-methods', '*')
  })
})
