export class CreateFileError extends Error {
  constructor () {
    super('Could not create file successfully')
    this.name = 'CreateFileError'
  }
}
