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
  CreateFileModel,
  HttpRequest
} from './upload-protocols'
import { UploadController } from './upload'
import { badRequest, internalServerError, ok } from '../../helpers/http-helper'

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
    async create (file: CreateFileModel): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }

  return new CreateFileStub()
}

const makeFakeFileModel = (): FileModel => ({
  id: 'valid_id',
  filename: 'valid_filename',
  path: 'valid_path',
  size: 1073741824
})

const makeAddFile = (): AddFile => {
  class AddFileStub implements AddFile {
    async add (file: AddFileModel): Promise<FileModel> {
      return await new Promise((resolve) => resolve(makeFakeFileModel()))
    }
  }

  return new AddFileStub()
}

const makeFakeHttpRequest = (): HttpRequest => {
  return {
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
  test('Should return 400 if no language is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {}
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('language')))
  })

  test('Should return 400 if no valid language is provided', async () => {
    const { sut, languageValidatorStub } = makeSut()
    jest.spyOn(languageValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = makeFakeHttpRequest()

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('language')))
  })

  test('Should return 500 if LanguageValidator throws', async () => {
    const { sut, languageValidatorStub } = makeSut()
    jest.spyOn(languageValidatorStub, 'isValid').mockImplementationOnce((language: string) => {
      throw new Error()
    })

    const httpRequest = makeFakeHttpRequest()

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(internalServerError(new ServerError(null)))
  })

  test('Should call LanguageValidator with correct language', async () => {
    const { sut, languageValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(languageValidatorStub, 'isValid')

    const httpRequest = makeFakeHttpRequest()

    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.language)
  })

  test('Should return 400 if no file is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        language: 'en'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('file')))
  })

  test('Should return 400 if no valid file is provided', async () => {
    const { sut, fileValidatorStub } = makeSut()
    jest.spyOn(fileValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = makeFakeHttpRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('file')))
  })

  test('Should return 500 if FileValidator throws', async () => {
    const { sut, fileValidatorStub } = makeSut()
    jest.spyOn(fileValidatorStub, 'isValid').mockImplementationOnce((file: File) => {
      throw new Error()
    })

    const httpRequest = makeFakeHttpRequest()

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(internalServerError(new ServerError(null)))
  })

  test('Should call FileValidator with correct file info', async () => {
    const { sut, fileValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(fileValidatorStub, 'isValid')

    const httpRequest = makeFakeHttpRequest()

    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.file)
  })

  test('Should call CreateFile with correct values', async () => {
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

    await sut.handle(httpRequest)
    expect(createFileSpy).toHaveBeenCalledWith({
      mimetype: 'video/mp4',
      filename: 'input.mp4',
      path: path.resolve(__dirname, 'input.mp4'),
      size: 1073741824,
      buffer: Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72])
    })
  })

  test('Should call AddFile with correct values', async () => {
    const { sut, addFileStub } = makeSut()
    const addFileSpy = jest.spyOn(addFileStub, 'add')
    const httpRequest = makeFakeHttpRequest()

    await sut.handle(httpRequest)
    expect(addFileSpy).toHaveBeenCalledWith({
      filename: 'any_filename',
      path: 'any_path',
      size: 1073741824
    })
  })

  test('Should return 500 if CreateFile throws', async () => {
    const { sut, createFileStub } = makeSut()
    jest.spyOn(createFileStub, 'create').mockImplementationOnce(async (file: CreateFileModel) => {
      return await Promise.reject(new Error())
    })

    const httpRequest = makeFakeHttpRequest()

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(internalServerError(new ServerError(null)))
  })

  test('Should return 500 if AddFile throws', async () => {
    const { sut, addFileStub } = makeSut()
    jest.spyOn(addFileStub, 'add').mockImplementationOnce(async (file: AddFileModel) => {
      return await Promise.reject(new Error())
    })

    const httpRequest = makeFakeHttpRequest()

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(internalServerError(new ServerError(null)))
  })

  test('Should return 200 if everything is fine', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeHttpRequest()

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok(makeFakeFileModel()))
  })
})
