import { FileModel, GetFile, GetFileRepository } from './db-get-file-protocols'

export class DbGetFile implements GetFile {
  private readonly getFileRepository: GetFileRepository

  constructor (getFileRepository: GetFileRepository) {
    this.getFileRepository = getFileRepository
  }

  async get (id: string): Promise<FileModel> {
    return await this.getFileRepository.get(id)
  }
}
