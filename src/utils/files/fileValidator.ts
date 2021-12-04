interface File {
  mimetype: string
  size: number
  destination: string
  filename: string
  path: string
  buffer?: Buffer
}

export class FileValidator {
  private errorFields = ''
  private readonly mimetypeRegEx = /(audio|video)\/([0-9A-Za-z-_]+)/g
  private readonly oneGigaByteLimit = 1073741824

  private verifyMimetype (mimetype: string): void {
    const isMimetypeValid = this.mimetypeRegEx.test(mimetype)

    if (!isMimetypeValid) {
      this.errorFields += 'mimetype'
    }
  }

  private verifySize (size: number): void {
    const limit = this.oneGigaByteLimit

    if (size > limit) {
      this.errorFields += this.errorFields ? ',size' : 'size'
    }
  }

  verify (fileInfo: File): any {
    this.errorFields = ''
    const { mimetype, size } = fileInfo

    this.verifyMimetype(mimetype)
    this.verifySize(size)

    if (this.errorFields) {
      const err = new Error('No valid file information provided')
      err.name = this.errorFields
      return err
    }
  }
}
