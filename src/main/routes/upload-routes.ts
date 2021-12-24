import { Router } from 'express'
import { uploadManager } from '../middlewares/multer/multer'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeUploadController } from '../factories/upload'

export default (router: Router): void => {
  router.post('/upload', uploadManager.single('media-file'), adaptRoute(makeUploadController()))
}
