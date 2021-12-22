import multer from 'multer'

export const uploadManager = multer({
  storage: multer.memoryStorage()
})
