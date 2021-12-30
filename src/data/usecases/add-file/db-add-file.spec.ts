import { AddFileModel, FileModel, AddFileRepository } from './db-add-file-protocols'
import { DbAddFile } from './db-add-file'

const makeAddFileRepository = (): AddFileRepository => {
  class AddFileRepositoryStub implements AddFileRepository {
    async add (fileData: AddFileModel): Promise<FileModel> {
      const fakeFile = {
        id: 'valid_id',
        filename: 'valid_filename',
        path: 'valid_path',
        size: 1073741824
      }

      return await new Promise((resolve) => resolve(fakeFile))
    }
  }

  return new AddFileRepositoryStub()
}

const makeValidFileData = (): AddFileModel => ({
  filename: 'valid_filename',
  path: 'valid_path',
  size: 1073741824
})

interface SutTypes {
  sut: DbAddFile
  addFileRepositoryStub: AddFileRepository
}

const makeSut = (): SutTypes => {
  const addFileRepositoryStub = makeAddFileRepository()
  const sut = new DbAddFile(addFileRepositoryStub)

  return {
    sut,
    addFileRepositoryStub
  }
}

describe('DbAddFile Usecase', () => {
  test('Should call DbAddFile with correct values', async () => {
    const { sut } = makeSut()
    const addSpy = jest.spyOn(sut, 'add')
    const fileData = makeValidFileData()

    await sut.add(fileData)
    expect(addSpy).toHaveBeenCalledWith(fileData)
  })

  test('Should call AddFileRepository with correct values', async () => {
    const { sut, addFileRepositoryStub } = makeSut()
    const addFileRepositorySpy = jest.spyOn(addFileRepositoryStub, 'add')
    const fileData = makeValidFileData()

    await sut.add(fileData)
    expect(addFileRepositorySpy).toHaveBeenCalledWith(fileData)
  })

  test('Should throw if AddFileRepository throws', async () => {
    const { sut, addFileRepositoryStub } = makeSut()
    jest.spyOn(addFileRepositoryStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))
    const fileData = makeValidFileData()

    const promise = sut.add(fileData)
    await expect(promise).rejects.toThrow()
  })

  test('Should return a file on success', async () => {
    const { sut } = makeSut()
    const fileData = makeValidFileData()

    const file = await sut.add(fileData)
    expect(file).toEqual({
      id: 'valid_id',
      filename: 'valid_filename',
      path: 'valid_path',
      size: 1073741824
    })
  })
})
