export interface CreateFileStorageModel {
  filename: string
  path: string
  size: number
  buffer: Buffer
}

export interface CreateFileStorage {
  create: (fileData: CreateFileStorageModel) => Promise<boolean>
}
