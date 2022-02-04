import { ServerError } from '../errors'
import { HttpResponse } from '../protocols/http'

export const badRequest = (error: Error): HttpResponse => {
  return {
    statusCode: 400,
    body: error
  }
}

export const notFound = (error: Error): HttpResponse => {
  return {
    statusCode: 404,
    body: error
  }
}

export const internalServerError = (error: Error): HttpResponse => {
  return {
    statusCode: 500,
    body: new ServerError(error.stack)
  }
}

export const ok = (body: any): HttpResponse => {
  return {
    statusCode: 200,
    body
  }
}

export const accepted = (body: any): HttpResponse => {
  return {
    statusCode: 202,
    body
  }
}
