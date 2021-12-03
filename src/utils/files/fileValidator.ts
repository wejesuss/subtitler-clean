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
  private readonly mimetypeRegEx = /^(audio|video)\/([0-9A-Za-z-_]+)$/g

  private verifyMimetype (mimetype: string): void {
    const isMimetypeValid = this.mimetypeRegEx.test(mimetype)

    if (!isMimetypeValid) {
      this.errorFields += 'mimetype'
    }
  }

  verify (fileInfo: File): any {
    this.errorFields = ''
    const { mimetype } = fileInfo

    this.verifyMimetype(mimetype)

    if (this.errorFields) {
      const err = new Error('No valid file information provided')
      err.name = this.errorFields
      return err
    }
  }
}
