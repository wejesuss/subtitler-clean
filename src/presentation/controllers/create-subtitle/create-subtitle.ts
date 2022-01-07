import { MissingParamError, NotFoundError } from '../../errors'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  badRequest,
  internalServerError,
  notFound,
  ok,
  GetFile,
  CreateSubtitle
} from './create-subtitle-protocols'

export class CreateSubtitleController implements Controller {
  private readonly getFile: GetFile
  private readonly createSubtitle: CreateSubtitle

  constructor (getFile: GetFile, createSubtitle: CreateSubtitle) {
    this.getFile = getFile
    this.createSubtitle = createSubtitle
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.body

      if (!id) {
        return badRequest(new MissingParamError('id'))
      }

      const file = await this.getFile.get(id)
      if (!file) {
        return notFound(new NotFoundError('file'))
      }

      await this.createSubtitle.create({
        filename: file.filename,
        path: file.path,
        size: file.size
      })

      return ok(true)
    } catch (error) {
      return internalServerError(error)
    }
  }
}
