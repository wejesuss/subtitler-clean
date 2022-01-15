export interface CreateSubtitleModel {
  id: string
  mimetype: string
  language: string
  filename: string
  path: string
  size: number
}

export interface CreateSubtitle {
  create: (file: CreateSubtitleModel) => Promise<boolean>
}
