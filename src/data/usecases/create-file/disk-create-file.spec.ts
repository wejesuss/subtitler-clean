import { CreateFileStorage, CreateFileStorageModel } from '../../protocols/create-file-storage'
import { DiskCreateFile } from './disk-create-file'

describe('DiskCreateFile Usecase', () => {
  test('Should call CreateFileStorage with correct values', async () => {
    class CreateFileStorageStub implements CreateFileStorage {
      async create (fileData: CreateFileStorageModel): Promise<boolean> {
        return await Promise.resolve(true)
      }
    }
    const createFileStorageStub = new CreateFileStorageStub()
    const sut = new DiskCreateFile(createFileStorageStub)
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
