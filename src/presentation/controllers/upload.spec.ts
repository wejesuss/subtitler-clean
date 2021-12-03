import { UploadController } from './upload'

describe('Upload Controller', () => {
  test('Should return 400 if no language is provided', () => {
    const sut = new UploadController()
    const httpRequest = {
      body: {},
      file: {}
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('No language provided'))
  })

  test('Should return 400 if no valid language is provided', () => {
    const sut = new UploadController()
    const httpRequest = {
      body: {
        language: 'dggd'
      },
      file: {}
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('No valid language provided'))
  })

  test('Should return 400 if no file is provided', () => {
    const sut = new UploadController()
    const httpRequest = {
      body: {
        language: 'en'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('No file information provided'))
  })
})
