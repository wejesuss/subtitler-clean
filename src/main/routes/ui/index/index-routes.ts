import { Router } from 'express'
import path from 'path'

export default (router: Router): void => {
  router.get('/', (req, res) => {
    const filePath = path.resolve(__dirname, '../../../../../public/views/pages', 'index.html')
    res.type('html')
    res.sendFile(filePath)
  })
}
