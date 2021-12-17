import { AddFile, AddFileModel, FileModel, AddFileRepository } from './db-add-file-protocols'

export class DbAddFile implements AddFile {
  private readonly addFileRepository: AddFileRepository

  constructor (addFileRepository: AddFileRepository) {
    this.addFileRepository = addFileRepository
  }

  async add (fileData: AddFileModel): Promise<FileModel> {
    await this.addFileRepository.add(fileData)
    return await new Promise(resolve => resolve(null))
  }
}
