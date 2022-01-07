import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { HttpRequest } from '../../protocols'
import { FileModel } from '../../../domain/models/file'
import { GetFile } from '../../../domain/usecases/get-file'
import { CreateSubtitleController } from './create-subtitle'
import { CreateSubtitle, CreateSubtitleModel } from '../../../domain/usecases/create-subtitle'

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {
    id: 'any_id'
  }
})

const makeFakeFileModel = (): FileModel => ({
  id: 'valid_id',
  filename: 'valid_filename',
  path: 'valid_path',
  size: 1073741824
})

const makeGetFile = (): GetFile => {
  class GetFileStub implements GetFile {
    async get (id: string): Promise<FileModel> {
      return await new Promise((resolve) => resolve(makeFakeFileModel()))
    }
  }

  return new GetFileStub()
}

const makeCreateSubtitle = (): CreateSubtitle => {
  class CreateSubtitleStub implements CreateSubtitle {
    async create (file: CreateSubtitleModel): Promise<boolean> {
      return true
    }
  }

  return new CreateSubtitleStub()
}

interface SutTypes {
  sut: CreateSubtitleController
  getFileStub: GetFile
  createSubtitleStub: CreateSubtitle
}

const makeSut = (): SutTypes => {
  const getFileStub = makeGetFile()
  const createSubtitleStub = makeCreateSubtitle()
  const sut = new CreateSubtitleController(getFileStub, createSubtitleStub)

  return {
    sut,
    getFileStub,
    createSubtitleStub
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

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual(new Error('Not found: resource file not found'))
  })

  test('Should call CreateSubtitle if file is found', async () => {
    const { sut, createSubtitleStub } = makeSut()
    const createSubtitleSpy = jest.spyOn(createSubtitleStub, 'create')

    await sut.handle(makeFakeHttpRequest())

    expect(createSubtitleSpy).toHaveBeenCalledWith({
      filename: 'valid_filename',
      path: 'valid_path',
      size: 1073741824
    })
  })
})