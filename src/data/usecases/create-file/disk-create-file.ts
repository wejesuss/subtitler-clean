import { CreateFile, CreateFileStorage, CreateFileModel } from './disk-create-file-protocols'

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
      return await Promise.reject(new Error('CreateFileStorage: File not created successfully'))
    }

    return await Promise.resolve(null)
  }
}
