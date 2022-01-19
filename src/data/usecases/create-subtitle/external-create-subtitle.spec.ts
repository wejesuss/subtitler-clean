import { CreateSubtitleService, CreateSubtitleModel, FileModel } from './external-create-subtitle-protocols'
import { ExternalCreateSubtitle } from './external-create-subtitle'

const makeFakeFileData = (): FileModel => ({
  id: 'valid_id',
  mimetype: 'valid_mimetype',
  language: 'valid_language',
  filename: 'valid_filename',
  path: 'valid_path',
  size: 1073741824
})

const makeFakeMediaData = (): CreateSubtitleModel => ({
  mimetype: 'valid_mimetype',
  language: 'valid_language',
  filename: 'valid_filename',
  path: 'valid_path'
})

const makeCreateSubtitleService = (): CreateSubtitleService => {
  class CreateSubtitleServiceStub implements CreateSubtitleService {
    async create (mediaData: CreateSubtitleModel): Promise<string> {
      return await new Promise((resolve) => resolve('valid_external_id'))
    }
  }

  return new CreateSubtitleServiceStub()
}

interface SutTypes {
  sut: ExternalCreateSubtitle
  createSubtitleServiceStub: CreateSubtitleService
}

const makeSut = (): SutTypes => {
  const createSubtitleServiceStub = makeCreateSubtitleService()
  const sut = new ExternalCreateSubtitle(createSubtitleServiceStub)

  return {
    sut,
    createSubtitleServiceStub
  }
}

describe('ExternalCreateSubtitle Usecase', () => {
  test('Should call CreateSubtitleService with correct values', async () => {
    const { sut, createSubtitleServiceStub } = makeSut()
    const createSubtitleServiceSpy = jest.spyOn(createSubtitleServiceStub, 'create')

    await sut.create(makeFakeFileData())

    expect(createSubtitleServiceSpy).toHaveBeenCalledWith(makeFakeMediaData())
  })
})
