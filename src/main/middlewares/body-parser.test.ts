import request from 'supertest'
import app from '../config/app'

describe('Body Parser Middleware', () => {
  test('Should parse body as json', async () => {
    app.post('/test-body-parser', (req, res) => res.json(req.body))

    await request(app)
      .post('/test-body-parser')
      .send({ filename: 'any_filename' })
      .expect({ filename: 'any_filename' })
  })
})
