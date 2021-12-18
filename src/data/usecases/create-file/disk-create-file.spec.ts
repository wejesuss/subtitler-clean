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
})
