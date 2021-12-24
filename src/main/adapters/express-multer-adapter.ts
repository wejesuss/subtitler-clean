import { resolve, parse } from 'path'
import { File } from '../../presentation/protocols/file-validator'

export const adaptRequestFile = (requestFile: Express.Multer.File): File => {
  const uploadFolder = resolve(__dirname, '../../../public/uploads', requestFile.originalname)
  const parsedPath = parse(uploadFolder)
  const destination = parsedPath.dir
  const filename = parsedPath.base
  const path = uploadFolder

  return {
    mimetype: requestFile.mimetype,
    size: requestFile.size,
    destination,
    filename,
    path,
    buffer: requestFile.buffer
  }
}
