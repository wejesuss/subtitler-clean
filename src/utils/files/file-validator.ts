import fs from 'fs'
import { dirname, isAbsolute } from 'path'
import { File, FileValidator } from '../../presentation/protocols/file-validator'

export class FileValidatorVanilla implements FileValidator {
  private isFieldValid = true
  private readonly mimetypeRegExp = /(audio|video)\/([0-9A-Za-z-_]+)/g
  private readonly oneGigaByteLimit = 1073741824

  private verifyMimetype (mimetype: string): void {
    const isMimetypeValid = this.mimetypeRegExp.test(mimetype)

    if (!isMimetypeValid) {
      this.isFieldValid = false
    }
  }

  private verifySize (size: number): void {
    const limit = this.oneGigaByteLimit

    if (size > limit) {
      this.isFieldValid = false
    }
  }

  private verifyPath (path: string, buffer?: Buffer): void {
    const exists = fs.existsSync(path)

    if ((!exists && !Buffer.isBuffer(buffer))) {
      this.isFieldValid = false
    }
  }

  private verifyDestination (path: string, destination: string): void {
    const dirPath = dirname(path)
    const dirDest = destination
    const isPathAbsolute = isAbsolute(dirPath) && isAbsolute(dirDest)

    if (!isPathAbsolute || dirDest !== dirPath) {
      this.isFieldValid = false
    }
  }

  isValid (fileInfo: File): boolean {
    this.isFieldValid = true
    const {
      mimetype,
      size,
      path,
      destination,
      buffer
    } = fileInfo

    this.verifyMimetype(mimetype)
    this.verifySize(size)
    this.verifyPath(path, buffer)
    this.verifyDestination(path, destination)

    if (!this.isFieldValid) {
      return false
    }

    return true
  }
}
