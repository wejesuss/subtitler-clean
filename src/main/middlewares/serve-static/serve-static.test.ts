import request from 'supertest'
import app from '../../config/app'
import fs from 'fs'
import path from 'path'

const fileName = 'test.txt'
const publicFile = path.resolve(__dirname, '../../../../public', `${fileName}`)

describe('Serve Static Middleware', () => {
  beforeAll(() => {
    fs.writeFileSync(publicFile, 'test content', { encoding: 'utf-8' })
  })

  afterAll(() => {
    fs.rmSync(publicFile)
  })

  test('Should have access to public', async () => {
    await request(app)
      .get(`/public/${fileName}`)
      .expect((res) => {
        expect(res.statusCode).toBe(200)
        expect(res.text).toBe('test content')
      })
  })
})
