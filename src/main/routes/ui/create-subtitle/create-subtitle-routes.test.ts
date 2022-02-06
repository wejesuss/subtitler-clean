import request from 'supertest'
import app from '../../../config/app'
import fs from 'fs'
import path from 'path'

describe('Create Subtitle Route', () => {
  test('Should return create-subtitle.html file', async () => {
    const fileContent = fs.readFileSync(path.resolve(__dirname, '../../../../../public/views/pages/create-subtitle.html'), { encoding: 'utf-8' })

    await request(app)
      .get('/create-subtitle')
      .expect((res) => {
        expect(res.statusCode).toBe(200)
        expect(res.header['content-type']).toContain('text/html')
        expect(res.text).toBe(fileContent)
      })
  })
})
