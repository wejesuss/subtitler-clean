import { FileModel } from '../../../domain/models/file'
import { AddFile, AddFileModel } from '../../../domain/usecases/add-file'

export class DbAddFile implements AddFile {
  async add (fileData: AddFileModel): Promise<FileModel> {
    return await new Promise(resolve => resolve(null))
  }
}
