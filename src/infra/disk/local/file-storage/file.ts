import { writeFileSync } from 'fs'
import { CreateFileStorage, CreateFileStorageModel } from '../../../../data/protocols/create-file-storage'

export class CreateFileLocalStorage implements CreateFileStorage {
  async create (fileData: CreateFileStorageModel): Promise<boolean> {
    return await new Promise((resolve) => {
      writeFileSync(fileData.path, fileData.buffer)
      resolve(true)
    })
  }
}
