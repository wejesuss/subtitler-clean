export interface File {
  mimetype: string
  size: number
  destination: string
  filename: string
  path: string
  buffer?: Buffer
}

export interface FileValidator {
  isValid: (file: File) => boolean
}
