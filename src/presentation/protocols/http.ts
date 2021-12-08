export interface HttpRequest {
  body?: any
  file?: {
    mimetype: string
    size: number
    destination: string
    filename: string
    path: string
    buffer?: Buffer
  }
}

export interface HttpResponse {
  statusCode: number
  body?: any
}
