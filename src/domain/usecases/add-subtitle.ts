import { SubtitleModel } from '../models/subtitle'

export interface AddSubtitleModel {
  id: string
  mimetype: string
  language: string
  filename: string
  path: string
  sent_to_creation: boolean
  external_id: string
}

export interface AddSubtitle {
  add: (file: AddSubtitleModel) => Promise<SubtitleModel>
}
