export class NotReadyError extends Error {
  constructor (resource: string) {
    super(`Not Ready: resource ${resource} is still not ready`)
    this.name = 'NotReadyError'
  }
}
