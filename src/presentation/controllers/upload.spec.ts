import { UploadController } from './upload'

describe('Upload Controller', () => {
  test('Should return 400 if not language is provided', () => {
    const sut = new UploadController()
    const httpRequest = {
      body: {},
      file: {}
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
})
