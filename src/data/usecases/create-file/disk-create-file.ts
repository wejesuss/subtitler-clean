import { CreateFile, CreateFileStorage, CreateFileModel } from './disk-create-file-protocols'
import { CreateFileError } from '../../errors/create-file-error'

export class DiskCreateFile implements CreateFile {
  private readonly createFileStorage: CreateFileStorage

  constructor (createFileStorage: CreateFileStorage) {
    this.createFileStorage = createFileStorage
  }

  async create (fileData: CreateFileModel): Promise<boolean> {
    const createdSuccessfully = await this.createFileStorage.create({
      filename: fileData.filename,
      path: fileData.path,
      size: fileData.size,
      buffer: fileData.buffer
    })

    if (!createdSuccessfully) {
      throw new CreateFileError()
    }

    return true
  }
}
