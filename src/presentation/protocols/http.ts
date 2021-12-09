import { File } from './file-validator'

export interface HttpRequest {
  body?: any
  file?: File
}

export interface HttpResponse {
  statusCode: number
  body?: any
}
