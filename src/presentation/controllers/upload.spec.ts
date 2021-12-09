import path from 'path'
import { InvalidParamError, MissingParamError, ServerError } from '../errors'
import { FileValidator, File } from '../protocols/file-validator'
import { LanguageValidator } from '../protocols/language-validator'
import { UploadController } from './upload'

const makeLanguageValidator = (): LanguageValidator => {
  class LanguageValidatorStub implements LanguageValidator {
    isValid (language: string): boolean {
      return true
    }
  }

  return new LanguageValidatorStub()
}

const makeFileValidator = (): FileValidator => {
  class FileValidatorStub implements FileValidator {
    isValid (file: File): boolean {
      return true
    }
  }

  return new FileValidatorStub()
}

interface SutTypes {
  sut: UploadController
  languageValidatorStub: LanguageValidator
  fileValidatorStub: FileValidator
}

const makeSut = (): SutTypes => {
  const languageValidatorStub = makeLanguageValidator()
  const fileValidatorStub = makeFileValidator()
  const sut = new UploadController(languageValidatorStub, fileValidatorStub)

  return {
    sut,
    languageValidatorStub,
    fileValidatorStub
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

  test('Should return 500 if LanguageValidator throws', () => {
    const { sut, languageValidatorStub } = makeSut()
    jest.spyOn(languageValidatorStub, 'isValid').mockImplementationOnce((language: string) => {
      throw new Error()
    })

    const httpRequest = {
      body: {
        language: 'any_language'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should call LanguageValidator with correct language', () => {
    const { sut, languageValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(languageValidatorStub, 'isValid')

    const httpRequest = {
      body: {
        language: 'any_language'
      }
    }

    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.language)
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
    const { sut, fileValidatorStub } = makeSut()
    jest.spyOn(fileValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        language: 'en'
      },
      file: {
        mimetype: 'invalid_mimetype',
        size: (1073741824 + 1),
        destination: 'invalid_destination',
        filename: 'invalid_filename',
        path: 'invalid_path'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('file'))
  })

  test('Should return 500 if FileValidator throws', () => {
    const { sut, fileValidatorStub } = makeSut()
    jest.spyOn(fileValidatorStub, 'isValid').mockImplementationOnce((file: File) => {
      throw new Error()
    })

    const httpRequest = {
      body: {
        language: 'any_language'
      },
      file: {
        mimetype: 'any_mimetype',
        size: 1073741824,
        destination: 'any_destination',
        filename: 'any_filename',
        path: 'any_path'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should call FileValidator with correct file info', () => {
    const { sut, fileValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(fileValidatorStub, 'isValid')

    const httpRequest = {
      body: {
        language: 'en'
      },
      file: {
        mimetype: 'any_mimetype',
        size: (1073741824 + 1),
        destination: 'any_destination',
        filename: 'any_filename',
        path: 'any_path'
      }
    }

    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.file)
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
