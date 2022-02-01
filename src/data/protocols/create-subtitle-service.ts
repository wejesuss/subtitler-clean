export interface CreateSubtitleModel {
  mimetype: string
  language: string
  filename: string
  path: string
}

export interface CreateSubtitleService {
  create: (mediaData: CreateSubtitleModel) => Promise<string>
}
