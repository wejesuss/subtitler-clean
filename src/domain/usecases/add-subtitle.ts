export interface AddSubtitleModel {
  id: string
  mimetype: string
  language: string
  filename: string
  path: string
  size: number
}

export interface AddSubtitle {
  add: (file: AddSubtitleModel) => Promise<boolean>
}
