import { UploadController } from './upload'

describe('Upload Controller', () => {
  test('Should return 400 if no language is provided', () => {
    const sut = new UploadController()
    const httpRequest = {
      body: {}
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
      }
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

  test('Should return 400 if no valid file is provided', () => {
    const sut = new UploadController()
    const httpRequest = {
      body: {
        language: 'en'
      },
      file: {
        mimetype: 'image/jpg',
        size: (1073741824 + 1),
        destination: 'public/uploads',
        filename: 'input.jpg',
        path: '/subtitler-clean/public/uploads/input.jpg'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    const err = new Error('No valid file information provided')
    err.name = 'mimetype,size,buffer,destination,path'

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(err)
    expect(httpResponse.body).toHaveProperty('name', err.name)
  })
})
