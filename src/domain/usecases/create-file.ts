export interface CreateFileModel {
  mimetype: string
  filename: string
  path: string
  size: number
  buffer: Buffer
}

export interface CreateFile {
  create: (file: CreateFileModel) => boolean
}
