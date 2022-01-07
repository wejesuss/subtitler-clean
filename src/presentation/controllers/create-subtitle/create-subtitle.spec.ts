import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { HttpRequest } from '../../protocols'
import { FileModel } from '../../../domain/models/file'
import { GetFile } from '../../../domain/usecases/get-file'
import { CreateSubtitleController } from './create-subtitle'

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

interface SutTypes {
  sut: CreateSubtitleController
  getFileStub: GetFile
}

const makeSut = (): SutTypes => {
  const getFileStub = makeGetFile()
  const sut = new CreateSubtitleController(getFileStub)

  return {
    sut,
    getFileStub
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
})
