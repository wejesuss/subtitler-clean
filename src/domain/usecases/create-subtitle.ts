export interface CreateSubtitleModel {
  mimetype: string
  filename: string
  path: string
  size: number
}

export interface CreateSubtitle {
  create: (file: CreateSubtitleModel) => Promise<boolean>
}
