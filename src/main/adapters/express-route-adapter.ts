import { Request, Response } from 'express'
import { Controller } from '../../presentation/protocols'
import { adaptRequestFile } from './express-multer-adapter'

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest = {
      body: req.body,
      file: req.file ? adaptRequestFile(req.file) : undefined
    }

    const httpResponse = await controller.handle(httpRequest)
    if (httpResponse.statusCode === 200) {
      res.status(httpResponse.statusCode).json(httpResponse.body)
    } else {
      res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message,
        name: httpResponse.body.name
      })
    }
  }
}
