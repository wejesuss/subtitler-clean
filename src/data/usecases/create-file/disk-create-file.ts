import { CreateFile, CreateFileModel } from '../../../domain/usecases/create-file'
import { CreateFileStorage } from '../../protocols/create-file-storage'

export class DiskCreateFile implements CreateFile {
  private readonly createFileStorage: CreateFileStorage

  constructor (createFileStorage: CreateFileStorage) {
    this.createFileStorage = createFileStorage
  }

  async create (fileData: CreateFileModel): Promise<boolean> {
    await this.createFileStorage.create({
      filename: fileData.filename,
      path: fileData.path,
      size: fileData.size,
      buffer: fileData.buffer
    })

    return await Promise.resolve(null)
  }
}
