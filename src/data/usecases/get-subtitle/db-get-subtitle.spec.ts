
import { SubtitleModel, GetSubtitleRepository } from './db-get-subtitle-protocols'
import { DbGetSubtitle } from './db-get-subtitle'

const makeFakeSubtitle = (): SubtitleModel => ({
  id: 'valid_id',
  language: 'valid_language',
  external_id: 'valid_external_id',
  sent_to_creation: true,
  file_id: 'valid_file_id'
})

const makeGetSubtitleRepository = (): GetSubtitleRepository => {
  class GetSubtitleRepositoryStub implements GetSubtitleRepository {
    async get (fileId: string): Promise<SubtitleModel> {
      return await new Promise((resolve) => resolve(makeFakeSubtitle()))
    }
  }

  return new GetSubtitleRepositoryStub()
}

interface SutTypes {
  sut: DbGetSubtitle
  getSubtitleRepositoryStub: GetSubtitleRepository
}

const makeSut = (): SutTypes => {
  const getSubtitleRepositoryStub = makeGetSubtitleRepository()
  const sut = new DbGetSubtitle(getSubtitleRepositoryStub)

  return {
    sut,
    getSubtitleRepositoryStub
  }
}

describe('DbGetSubtitle Usecase', () => {
  test('Should call GetSubtitleRepository with correct value', async () => {
    const { sut, getSubtitleRepositoryStub } = makeSut()
    const getSubtitleSpy = jest.spyOn(getSubtitleRepositoryStub, 'get')
    const id = 'valid_id'

    await sut.get(id)

    expect(getSubtitleSpy).toHaveBeenCalledWith(id)
  })

  test('Should throw if GetSubtitleRepository throws', async () => {
    const { sut, getSubtitleRepositoryStub } = makeSut()
    jest.spyOn(getSubtitleRepositoryStub, 'get').mockImplementationOnce(async () => {
      throw new Error()
    })

    const promise = sut.get('valid_id')

    await expect(promise).rejects.toThrow()
  })
})
