import { FileModel, GetFileRepository } from './db-get-file-protocols'
import { DbGetFile } from './db-get-file'

const makeFakeFile = (): FileModel => ({
  id: 'valid_id',
  mimetype: 'valid_mimetype',
  language: 'valid_language',
  filename: 'valid_filename',
  path: 'valid_path',
  size: 1073741824
})

const makeGetFileRepository = (): GetFileRepository => {
  class GetFileRepositoryStub implements GetFileRepository {
    async get (id: string): Promise<FileModel> {
      return await new Promise((resolve) => resolve(makeFakeFile()))
    }
  }

  return new GetFileRepositoryStub()
}

interface SutTypes {
  sut: DbGetFile
  getFileRepositoryStub: GetFileRepository
}

const makeSut = (): SutTypes => {
  const getFileRepositoryStub = makeGetFileRepository()
  const sut = new DbGetFile(getFileRepositoryStub)

  return {
    sut,
    getFileRepositoryStub
  }
}

describe('DbGetFile Usecase', () => {
  test('Should call GetFileRepository with correct value', async () => {
    const { sut, getFileRepositoryStub } = makeSut()
    const getFileSpy = jest.spyOn(getFileRepositoryStub, 'get')
    const id = 'valid_id'

    await sut.get(id)

    expect(getFileSpy).toHaveBeenCalledWith(id)
  })

  test('Should throw if GetFileRepository throws', async () => {
    const { sut, getFileRepositoryStub } = makeSut()
    jest.spyOn(getFileRepositoryStub, 'get').mockImplementationOnce(async () => {
      throw new Error()
    })

    const promise = sut.get('valid_id')

    await expect(promise).rejects.toThrow()
  })
})
