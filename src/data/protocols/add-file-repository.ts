import { FileModel } from '../../domain/models/file'
import { AddFileModel } from '../../domain/usecases/add-file'

export interface AddFileRepository {
  add: (fileData: AddFileModel) => Promise<FileModel>
}
