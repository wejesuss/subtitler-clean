import { SubtitleModel } from '../models/subtitle'

export interface GetSubtitle {
  get: (fileId: string) => Promise<SubtitleModel>
}
