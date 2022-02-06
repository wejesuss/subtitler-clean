import request from 'supertest'
import app from '../../../config/app'
import fs from 'fs'
import path from 'path'

describe('Index Route', () => {
  test('Should return index.html file', async () => {
    const fileContent = fs.readFileSync(path.resolve(__dirname, '../../../../../public/views/pages/index.html'), { encoding: 'utf-8' })

    await request(app)
      .get('/')
      .expect((res) => {
        expect(res.statusCode).toBe(200)
        expect(res.header['content-type']).toContain('text/html')
        expect(res.text).toBe(fileContent)
      })
  })
})
