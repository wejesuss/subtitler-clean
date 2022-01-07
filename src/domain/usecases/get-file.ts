import { FileModel } from '../models/file'

export interface GetFile {
  get: (id: string) => Promise<FileModel>
}
