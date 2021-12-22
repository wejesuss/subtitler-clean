import { Router } from 'express'
import { uploadManager } from '../middlewares/multer/multer'

export default (router: Router): void => {
  router.post('/upload', uploadManager.single('media-file'), (req, res) => {
    return res.json({ ok: 'ok' })
  })
}
