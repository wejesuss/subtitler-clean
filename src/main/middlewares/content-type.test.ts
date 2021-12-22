import request from 'supertest'
import app from '../config/app'

describe('Content Type Middleware', () => {
  test('Should set json as content type by default', async () => {
    app.get('/test-content-type', (req, res) => res.send())

    await request(app)
      .get('/test-content-type')
      .expect('content-type', /json/)
  })

  test('Should set xml as content type', async () => {
    app.get('/test-content-type-xml', (req, res) => {
      res.type('xml')
      res.send('')
    })

    await request(app)
      .get('/test-content-type-xml')
      .expect('content-type', /xml/)
  })
})
