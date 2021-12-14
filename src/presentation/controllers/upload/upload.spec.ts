import path from 'path'
import {
  InvalidParamError,
  MissingParamError,
  ServerError
} from '../../errors'
import {
  FileValidator,
  File,
  LanguageValidator,
  AddFile,
  AddFileModel,
  FileModel,
  CreateFile,
  CreateFileModel
} from './upload-protocols'
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

const makeCreateFile = (): CreateFile => {
  class CreateFileStub implements CreateFile {
    create (file: CreateFileModel): boolean {
      return true
    }
  }

  return new CreateFileStub()
}

const makeAddFile = (): AddFile => {
  class AddFileStub implements AddFile {
    add (file: AddFileModel): FileModel {
      return {
        id: 'valid_id',
        filename: 'valid_filename',
        path: 'valid_path',
        size: 1073741824
      }
    }
  }

  return new AddFileStub()
}

interface SutTypes {
  sut: UploadController
  languageValidatorStub: LanguageValidator
  fileValidatorStub: FileValidator
  createFileStub: CreateFile
  addFileStub: AddFile
}

const makeSut = (): SutTypes => {
  const languageValidatorStub = makeLanguageValidator()
  const fileValidatorStub = makeFileValidator()
  const createFileStub = makeCreateFile()
  const addFileStub = makeAddFile()
  const sut = new UploadController(languageValidatorStub, fileValidatorStub, createFileStub, addFileStub)

  return {
    sut,
    languageValidatorStub,
    fileValidatorStub,
    createFileStub,
    addFileStub
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

  test('Should call CreateFile with correct values', () => {
    const { sut, createFileStub } = makeSut()
    const createFileSpy = jest.spyOn(createFileStub, 'create')
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
        buffer: Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72])
      }
    }

    sut.handle(httpRequest)
    expect(createFileSpy).toHaveBeenCalledWith({
      mimetype: 'video/mp4',
      filename: 'input.mp4',
      path: path.resolve(__dirname, 'input.mp4'),
      size: 1073741824,
      buffer: Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72])
    })
  })

  test('Should call AddFile with correct values', () => {
    const { sut, addFileStub } = makeSut()
    const addFileSpy = jest.spyOn(addFileStub, 'add')
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

    sut.handle(httpRequest)
    expect(addFileSpy).toHaveBeenCalledWith({
      filename: 'input.mp4',
      path: path.resolve(__dirname, 'input.mp4'),
      size: 1073741824
    })
  })

  test('Should return 500 if CreateFile throws', () => {
    const { sut, createFileStub } = makeSut()
    jest.spyOn(createFileStub, 'create').mockImplementationOnce((file: CreateFileModel) => {
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

  test('Should return 500 if AddFile throws', () => {
    const { sut, addFileStub } = makeSut()
    jest.spyOn(addFileStub, 'add').mockImplementationOnce((file: AddFileModel) => {
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
