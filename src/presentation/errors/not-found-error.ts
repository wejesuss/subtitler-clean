export class NotFoundError extends Error {
  constructor (resource: string) {
    super(`Not found: resource ${resource} not found`)
    this.name = 'NotFoundError'
  }
}
