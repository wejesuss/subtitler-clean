import request from 'supertest'
import app from '../../../config/app'
import fs from 'fs'
import path from 'path'

describe('Download Subtitle Route', () => {
  test('Should return download-subtitle.html file', async () => {
    const fileContent = fs.readFileSync(path.resolve(__dirname, '../../../../../public/views/pages/download-subtitle.html'), { encoding: 'utf-8' })

    await request(app)
      .get('/download-subtitle')
      .expect((res) => {
        expect(res.statusCode).toBe(200)
        expect(res.header['content-type']).toContain('text/html')
        expect(res.text).toBe(fileContent)
      })
  })
})
