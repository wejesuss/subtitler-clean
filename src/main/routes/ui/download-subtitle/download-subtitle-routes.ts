import { Router } from 'express'
import path from 'path'

export default (router: Router): void => {
  router.get('/download-subtitle', (req, res) => {
    const filePath = path.resolve(__dirname, '../../../../../public/views/pages', 'download-subtitle.html')
    res.type('html')
    res.sendFile(filePath)
  })
}
