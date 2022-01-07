export interface CreateSubtitleModel {
  filename: string
  path: string
  size: number
}

export interface CreateSubtitle {
  create: (file: CreateSubtitleModel) => Promise<boolean>
}
