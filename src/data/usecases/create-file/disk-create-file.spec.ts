import { CreateFileStorage, CreateFileStorageModel } from './disk-create-file-protocols'
import { DiskCreateFile } from './disk-create-file'

const makeCreateFileStorage = (): CreateFileStorage => {
  class CreateFileStorageStub implements CreateFileStorage {
    async create (fileData: CreateFileStorageModel): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }

  return new CreateFileStorageStub()
}

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

    const fileData = {
      mimetype: 'valid_mimetype',
      filename: 'valid_filename',
      path: 'valid_path',
      size: 1073741824,
      buffer: Buffer.from('')
    }

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

    const fileData = {
      mimetype: 'valid_mimetype',
      filename: 'valid_filename',
      path: 'valid_path',
      size: 1073741824,
      buffer: Buffer.from('')
    }

    const promise = sut.create(fileData)
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if CreateFileStorage returns false', async () => {
    const { sut, createFileStorageStub } = makeSut()
    jest.spyOn(createFileStorageStub, 'create').mockReturnValueOnce(Promise.resolve(false))

    const fileData = {
      mimetype: 'valid_mimetype',
      filename: 'valid_filename',
      path: 'valid_path',
      size: 1073741824,
      buffer: Buffer.from('')
    }

    const promise = sut.create(fileData)
    await expect(promise).rejects.toThrowError(new Error('CreateFileStorage: File not created successfully'))
  })
})
