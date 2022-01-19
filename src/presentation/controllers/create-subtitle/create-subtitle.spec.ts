import { MissingParamError, NotFoundError, ServerError } from '../../errors'
import { CreateSubtitleController } from './create-subtitle'
import {
  HttpRequest,
  FileModel,
  SubtitleModel,
  GetFile,
  GetSubtitle,
  AddSubtitleModel,
  AddSubtitle,
  CreateSubtitle
} from './create-subtitle-protocols'
import { badRequest, notFound, internalServerError, ok } from '../../helpers/http-helper'

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {
    id: 'any_id'
  }
})

const makeFakeFileModel = (): FileModel => ({
  id: 'valid_id',
  mimetype: 'valid_mimetype',
  language: 'valid_language',
  filename: 'valid_filename',
  path: 'valid_path',
  size: 1073741824
})

const makeFakeAddSubtitleModel = (): AddSubtitleModel => ({
  id: 'valid_id',
  mimetype: 'valid_mimetype',
  language: 'valid_language',
  filename: 'valid_filename',
  path: 'valid_path',
  sent_to_creation: true,
  external_id: 'valid_external_id'
})

const makeFakeSubtitleModel = (): SubtitleModel => ({
  id: 'valid_id',
  language: 'valid_language',
  sent_to_creation: true,
  file_id: 'valid_file_id',
  external_id: 'valid_external_id'
})

const makeGetFile = (): GetFile => {
  class GetFileStub implements GetFile {
    async get (id: string): Promise<FileModel> {
      return await new Promise((resolve) => resolve(makeFakeFileModel()))
    }
  }

  return new GetFileStub()
}

const makeGetSubtitle = (): GetSubtitle => {
  class GetSubtitleStub implements GetSubtitle {
    async get (fileId: string): Promise<SubtitleModel> {
      return await new Promise((resolve) => resolve(null))
    }
  }

  return new GetSubtitleStub()
}

const makeCreateSubtitle = (): CreateSubtitle => {
  class CreateSubtitleStub implements CreateSubtitle {
    async create (file: FileModel): Promise<AddSubtitleModel> {
      return await new Promise((resolve) => resolve(makeFakeAddSubtitleModel()))
    }
  }

  return new CreateSubtitleStub()
}

const makeAddSubtitle = (): AddSubtitle => {
  class AddSubtitleStub implements AddSubtitle {
    async add (file: AddSubtitleModel): Promise<SubtitleModel> {
      return await new Promise((resolve) => resolve(makeFakeSubtitleModel()))
    }
  }

  return new AddSubtitleStub()
}

interface SutTypes {
  sut: CreateSubtitleController
  getFileStub: GetFile
  getSubtitleStub: GetSubtitle
  createSubtitleStub: CreateSubtitle
  addSubtitleStub: AddSubtitle
}

const makeSut = (): SutTypes => {
  const getFileStub = makeGetFile()
  const getSubtitleStub = makeGetSubtitle()
  const createSubtitleStub = makeCreateSubtitle()
  const addSubtitleStub = makeAddSubtitle()
  const sut = new CreateSubtitleController(getFileStub, getSubtitleStub, createSubtitleStub, addSubtitleStub)

  return {
    sut,
    getFileStub,
    getSubtitleStub,
    createSubtitleStub,
    addSubtitleStub
  }
}

describe('Create Subtitle Controller', () => {
  test('Should return 400 if no file id is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('id')))
  })

  test('Should call GetFile with correct value', async () => {
    const { sut, getFileStub } = makeSut()
    const getFileSpy = jest.spyOn(getFileStub, 'get')

    await sut.handle(makeFakeHttpRequest())

    expect(getFileSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return 404 if file is not found with the provided id', async () => {
    const { sut, getFileStub } = makeSut()
    jest.spyOn(getFileStub, 'get').mockReturnValueOnce(new Promise((resolve) => resolve(null)))

    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse).toEqual(notFound(new NotFoundError('file')))
  })

  test('Should return 500 if GetFile throws', async () => {
    const { sut, getFileStub } = makeSut()
    jest.spyOn(getFileStub, 'get').mockImplementationOnce((file) => {
      throw new Error()
    })

    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse).toEqual(internalServerError(new ServerError(null)))
  })

  test('Should call CreateSubtitle with correct values', async () => {
    const { sut, createSubtitleStub } = makeSut()
    const createSubtitleSpy = jest.spyOn(createSubtitleStub, 'create')

    await sut.handle(makeFakeHttpRequest())

    expect(createSubtitleSpy).toHaveBeenCalledWith(makeFakeFileModel())
  })

  test('Should return 500 if CreateSubtitle throws', async () => {
    const { sut, createSubtitleStub } = makeSut()
    jest.spyOn(createSubtitleStub, 'create').mockImplementationOnce(async () => {
      throw new Error()
    })

    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse).toEqual(internalServerError(new ServerError(null)))
  })

  test('Should call AddSubtitle if file is found', async () => {
    const { sut, addSubtitleStub } = makeSut()
    const addSubtitleSpy = jest.spyOn(addSubtitleStub, 'add')

    await sut.handle(makeFakeHttpRequest())

    expect(addSubtitleSpy).toHaveBeenCalledWith(makeFakeAddSubtitleModel())
  })

  test('Should return 500 if AddSubtitle throws', async () => {
    const { sut, addSubtitleStub } = makeSut()
    jest.spyOn(addSubtitleStub, 'add').mockImplementationOnce((file) => {
      throw new Error()
    })

    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse).toEqual(internalServerError(new ServerError(null)))
  })

  test('Should call GetSubtitle with correct value', async () => {
    const { sut, getSubtitleStub } = makeSut()
    const getSubtitleSpy = jest.spyOn(getSubtitleStub, 'get')

    await sut.handle(makeFakeHttpRequest())

    expect(getSubtitleSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should not call CreateSubtitle if subtitle already exists', async () => {
    const { sut, getSubtitleStub, createSubtitleStub } = makeSut()
    jest.spyOn(getSubtitleStub, 'get').mockReturnValueOnce(new Promise((resolve) => resolve(makeFakeSubtitleModel())))
    const createSubtitleSpy = jest.spyOn(createSubtitleStub, 'create')

    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(createSubtitleSpy).toHaveBeenCalledTimes(0)
    expect(httpResponse).toEqual(ok(makeFakeSubtitleModel()))
  })

  test('Should not call AddSubtitle if subtitle already exists', async () => {
    const { sut, getSubtitleStub, addSubtitleStub } = makeSut()
    jest.spyOn(getSubtitleStub, 'get').mockReturnValueOnce(new Promise((resolve) => resolve(makeFakeSubtitleModel())))
    const addSubtitleSpy = jest.spyOn(addSubtitleStub, 'add')

    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(addSubtitleSpy).toHaveBeenCalledTimes(0)
    expect(httpResponse).toEqual(ok(makeFakeSubtitleModel()))
  })

  test('Should return 500 if GetSubtitle throws', async () => {
    const { sut, getSubtitleStub } = makeSut()
    jest.spyOn(getSubtitleStub, 'get').mockImplementationOnce((fileId) => {
      throw new Error()
    })

    const httpResponse = await sut.handle(makeFakeHttpRequest())

    expect(httpResponse).toEqual(internalServerError(new ServerError(null)))
  })

  test('Should return 200 if everything is fine', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(ok(makeFakeSubtitleModel()))
  })
})
