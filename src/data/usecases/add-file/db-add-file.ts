import { FileModel } from '../../../domain/models/file'
import { AddFile, AddFileModel } from '../../../domain/usecases/add-file'
import { AddFileRepository } from '../../protocols/add-file-repository'

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
