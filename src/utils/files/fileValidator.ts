interface File {
  mimetype: string
  size: number
  destination: string
  filename: string
  path: string
  buffer?: Buffer
}

export class FileValidator {
  verify (fileInfo: File): any {
    const { mimetype } = fileInfo
    let errorFields = ''

    const test = /(audio|video)\/([0-9A-Za-z-_]+)/g
    const isMimetypeValid = test.test(mimetype)

    if (!isMimetypeValid) {
      errorFields += 'mimetype'
    }

    if (errorFields) {
      const err = new Error('No valid file information provided')
      err.name = errorFields
      return err
    }
  }
}
