import { AddFileRepository } from '../../../../data/protocols/add-file-repository'
import { AddFileModel } from '../../../../domain/usecases/add-file'
import { FileModel } from '../../../../domain/models/file'
import { SQLiteHelper } from '../helpers/sqlite-helper'

export class FileSQLiteRepository implements AddFileRepository {
  async add (fileData: AddFileModel): Promise<FileModel> {
    const file = await SQLiteHelper.insertOne('files', fileData)

    return file
  }
}
