import { AddSubtitleModel, AddSubtitleRepository, SubtitleModel } from './db-add-subtitle-protocols'
import { DbAddSubtitle } from './db-add-subtitle'

const makeFakeSubtitle = (): SubtitleModel => ({
  id: 'valid_id',
  language: 'valid_language',
  sent_to_creation: true,
  external_id: 'valid_external_id',
  file_id: 'valid_file_id'
})

const makeValidFileData = (): AddSubtitleModel => ({
  id: 'valid_id',
  filename: 'valid_filename',
  mimetype: 'valid_mimetype',
  language: 'valid_language',
  path: 'valid_path',
  size: 1073741824
})

const makeAddSubtitleRepository = (): AddSubtitleRepository => {
  class AddSubtitleRepositoryStub implements AddSubtitleRepository {
    async add (file: AddSubtitleModel): Promise<SubtitleModel> {
      return await new Promise((resolve) => resolve(makeFakeSubtitle()))
    }
  }

  return new AddSubtitleRepositoryStub()
}

interface SutTypes {
  sut: DbAddSubtitle
  addSubtitleRepositoryStub: AddSubtitleRepository
}

const makeSut = (): SutTypes => {
  const addSubtitleRepositoryStub = makeAddSubtitleRepository()
  const sut = new DbAddSubtitle(addSubtitleRepositoryStub)

  return {
    sut,
    addSubtitleRepositoryStub
  }
}

describe('DbAddSubtitle Usecase', () => {
  test('Should call AddSubtitleRepository with correct values', async () => {
    const { sut, addSubtitleRepositoryStub } = makeSut()
    const addSubtitleSpy = jest.spyOn(addSubtitleRepositoryStub, 'add')

    const fileData = makeValidFileData()
    await sut.add(fileData)

    expect(addSubtitleSpy).toHaveBeenCalledWith(fileData)
  })

  test('Should throw if AddSubtitleRepository throws', async () => {
    const { sut, addSubtitleRepositoryStub } = makeSut()
    jest.spyOn(addSubtitleRepositoryStub, 'add').mockImplementationOnce(async () => {
      throw new Error()
    })

    const promise = sut.add(makeValidFileData())

    await expect(promise).rejects.toThrow()
  })

  test('Should return true on success', async () => {
    const { sut } = makeSut()

    const created = await sut.add(makeValidFileData())

    expect(created).toBe(true)
  })
})
