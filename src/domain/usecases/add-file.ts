import { FileModel } from '../models/file'

export interface AddFileModel {
  mimetype: string
  language: string
  filename: string
  path: string
  size: number
}

export interface AddFile {
  add: (file: AddFileModel) => Promise<FileModel>
}
