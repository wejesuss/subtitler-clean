import request from 'supertest'
import app from '../config/app'

describe('Upload Route', () => {
  test('Should return a file on success', async () => {
    const fileData = Buffer.from([73, 68, 51, 4, 0, 0, 0, 0, 0, 114, 84, 69,
      78, 67, 0, 0, 0, 19, 0, 0, 3, 65, 100, 111,
      98, 101, 32, 83, 121, 115, 116, 101, 109, 115, 32, 73,
      110, 99, 0, 84, 68, 82, 67, 0, 0, 0, 12, 0,
      0, 3, 50, 48, 49, 52, 45, 48, 52, 45, 48, 51,
      0, 84, 88, 88, 88, 0, 0, 0, 18, 0, 0, 3,
      116, 105, 109, 101, 95, 114, 101, 102, 101, 114, 101, 110,
      99, 101, 0, 48, 0, 84, 83, 83, 69, 0, 0, 0,
      15, 0, 0, 3])

    await request(app)
      .post('/api/upload')
      .attach('media-file', fileData, {
        filename: 'sample.mp3',
        contentType: 'audio/mpeg'
      })
      .field('language', 'en')
      .expect(200)
  })
})
