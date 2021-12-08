import path from 'path'
import { InvalidParamError } from '../errors/invalid-param-error'
import { MissingParamError } from '../errors/missing-param-error'
import { LanguageValidator } from '../protocols/language-validator'
import { UploadController } from './upload'

interface SutTypes {
  sut: UploadController
  languageValidatorStub: LanguageValidator
}

const makeSut = (): SutTypes => {
  class LanguageValidatorStub implements LanguageValidator {
    isValid (language: string): boolean {
      return true
    }
  }

  const languageValidatorStub = new LanguageValidatorStub()
  const sut = new UploadController(languageValidatorStub)

  return {
    sut,
    languageValidatorStub
  }
}

describe('Upload Controller', () => {
  test('Should return 400 if no language is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {}
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('language'))
  })

  test('Should return 400 if no valid language is provided', () => {
    const { sut, languageValidatorStub } = makeSut()
    jest.spyOn(languageValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        language: 'invalid_language'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('language'))
  })

  test('Should return 400 if no file is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        language: 'en'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('file'))
  })

  test('Should return 400 if no valid file is provided', () => {
    const { sut } = makeSut()

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

  test('Should return 200 if everything is fine', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        language: 'en'
      },
      file: {
        mimetype: 'video/mp4',
        size: 1073741824,
        destination: path.resolve(__dirname),
        filename: 'input.mp4',
        path: path.resolve(__dirname, 'input.mp4'),
        buffer: Buffer.from('')
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
  })
})
