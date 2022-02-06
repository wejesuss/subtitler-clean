import { Router } from 'express'
import path from 'path'

export default (router: Router): void => {
  router.get('/create-subtitle', (req, res) => {
    const filePath = path.resolve(__dirname, '../../../../../public/views/pages', 'create-subtitle.html')
    res.type('html')
    res.sendFile(filePath)
  })
}
