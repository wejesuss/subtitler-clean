import { AddFile, AddFileModel, FileModel, AddFileRepository } from './db-add-file-protocols'

export class DbAddFile implements AddFile {
  private readonly addFileRepository: AddFileRepository

  constructor (addFileRepository: AddFileRepository) {
    this.addFileRepository = addFileRepository
  }

  async add (fileData: AddFileModel): Promise<FileModel> {
    const file = await this.addFileRepository.add(fileData)
    return file
  }
}
