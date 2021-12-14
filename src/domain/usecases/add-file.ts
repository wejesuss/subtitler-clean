import { FileModel } from '../models/file'

export interface AddFileModel {
  filename: string
  path: string
  size: number
}

export interface AddFile {
  add: (file: AddFileModel) => FileModel
}
