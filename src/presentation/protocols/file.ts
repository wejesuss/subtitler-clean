export interface File {
  mimetype: string
  size: number
  destination: string
  filename: string
  path: string
  buffer?: Buffer
}
