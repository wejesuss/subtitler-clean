import path from 'path'
import { web } from '../../../subtitler-credentials.json'

export default {
  dbFilename: process.env.SQLITE_FILENAME || 'subtitler.db',
  port: process.env.PORT || 3000,
  inputImage: process.env.INPUT_IMAGE || path.resolve(__dirname, '../../../public/image.jpg'),
  clientId: web.client_id,
  clientSecret: web.client_secret,
  redirectUri: web.redirect_uris[0]
}
