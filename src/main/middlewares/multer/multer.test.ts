import request from 'supertest'
import app from '../../config/app'
import { uploadManager } from './multer'

describe('Multer Middleware', () => {
  test('Should enable file upload', async () => {
    app.get('/test-multer', uploadManager.single('test-file'), (req, res) => {
      res.json({
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        buffer: req.file.buffer,
        size: req.file.size
      })
    })

    await request(app)
      .get('/test-multer')
      .attach('test-file', Buffer.from('sending text file'), {
        filename: 'sample.txt',
        contentType: 'text/plain'
      })
      .expect((res) => {
        const buffer = Buffer.from('sending text file').toJSON()

        expect(res.statusCode).toBe(200)
        expect(res.body.fieldname).toBe('test-file')
        expect(res.body.originalname).toBe('sample.txt')
        expect(res.body.mimetype).toBe('text/plain')
        expect(res.body.size).toBe(17)

        expect(res.body.buffer).toBeTruthy()
        expect(res.body.buffer.type).toBe(buffer.type)
        expect(res.body.buffer.data).toEqual(buffer.data)
      })
  })
})
