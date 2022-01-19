import { FileModel } from '../models/file'
import { AddSubtitleModel } from './add-subtitle'

export interface CreateSubtitle {
  create: (file: FileModel) => Promise<AddSubtitleModel>
}
