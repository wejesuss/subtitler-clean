import { CreateFileModel, CreateFileStorage, CreateFileStorageModel } from './disk-create-file-protocols'
import { CreateFileError } from '../../errors/create-file-error'
import { DiskCreateFile } from './disk-create-file'

const makeCreateFileStorage = (): CreateFileStorage => {
  class CreateFileStorageStub implements CreateFileStorage {
    async create (fileData: CreateFileStorageModel): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }

  return new CreateFileStorageStub()
}

const makeValidFileData = (): CreateFileModel => ({
  mimetype: 'valid_mimetype',
  filename: 'valid_filename',
  path: 'valid_path',
  size: 1073741824,
  buffer: Buffer.from('')
})

interface SutTypes {
  sut: DiskCreateFile
  createFileStorageStub: CreateFileStorage
}

const makeSut = (): SutTypes => {
  const createFileStorageStub = makeCreateFileStorage()
  const sut = new DiskCreateFile(createFileStorageStub)

  return {
    sut,
    createFileStorageStub
  }
}

describe('DiskCreateFile Usecase', () => {
  test('Should call CreateFileStorage with correct values', async () => {
    const { sut, createFileStorageStub } = makeSut()
    const createFileStorageSpy = jest.spyOn(createFileStorageStub, 'create')

    const fileData = makeValidFileData()

    await sut.create(fileData)

    expect(createFileStorageSpy).toHaveBeenCalledWith({
      filename: 'valid_filename',
      path: 'valid_path',
      size: 1073741824,
      buffer: Buffer.from('')
    })
  })

  test('Should throw if CreateFileStorage throws', async () => {
    const { sut, createFileStorageStub } = makeSut()
    jest.spyOn(createFileStorageStub, 'create').mockReturnValueOnce(Promise.reject(new Error()))

    const fileData = makeValidFileData()

    const promise = sut.create(fileData)
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if CreateFileStorage returns false', async () => {
    const { sut, createFileStorageStub } = makeSut()
    jest.spyOn(createFileStorageStub, 'create').mockReturnValueOnce(Promise.resolve(false))

    const fileData = makeValidFileData()

    const promise = sut.create(fileData)
    await expect(promise).rejects.toThrowError(new CreateFileError())
  })

  test('Should return true if CreateFileStorage returns true', async () => {
    const { sut } = makeSut()

    const fileData = makeValidFileData()

    const created = await sut.create(fileData)
    expect(created).toBe(true)
  })
})
