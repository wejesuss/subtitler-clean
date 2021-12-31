import { UploadController } from '../../presentation/controllers/upload/upload'
import { FileValidatorAdapter } from '../../utils/files/file-validator-adapter'
import { LanguageValidatorAdapter } from '../../utils/languages/language-validator-adapter'
import { DiskCreateFile } from '../../data/usecases/create-file/disk-create-file'
import { DbAddFile } from '../../data/usecases/add-file/db-add-file'
import { CreateFileLocalStorage } from '../../infra/disk/local/file-storage/file'
import { FileSQLiteRepository } from '../../infra/db/sqlite/file-repository/file'
import { LogSQLiteRepository } from '../../infra/db/sqlite/log-repository/log'
import { LogControllerDecorator } from '../decorators/log'
import { Controller } from '../../presentation/protocols'

export const makeUploadController = (): Controller => {
  const languageValidatorAdapter = new LanguageValidatorAdapter()
  const fileValidatorAdapter = new FileValidatorAdapter()
  const createFileLocalStorage = new CreateFileLocalStorage()
  const fileSQLiteRepository = new FileSQLiteRepository()
  const createFile = new DiskCreateFile(createFileLocalStorage)
  const addFile = new DbAddFile(fileSQLiteRepository)
  const uploadController = new UploadController(languageValidatorAdapter, fileValidatorAdapter, createFile, addFile)
  const logSQLiteRepository = new LogSQLiteRepository()

  return new LogControllerDecorator(uploadController, logSQLiteRepository)
}
