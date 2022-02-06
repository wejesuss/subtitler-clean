import express, { Response } from 'express'
import path from 'path'

const setHeaders = (res: Response, filePath: string): any => {
  res.type(path.extname(filePath))
}

const publicFolder = path.resolve(__dirname, '../../../../public')
export const serveStatic = express.static(publicFolder, {
  setHeaders: setHeaders
})
