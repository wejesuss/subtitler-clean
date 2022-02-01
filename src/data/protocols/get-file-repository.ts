import { FileModel } from '../../domain/models/file'

export interface GetFileRepository {
  get: (id: string) => Promise<FileModel>
}
