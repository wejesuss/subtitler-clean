import env from './config/env'
import { SQLiteHelper } from '../infra/db/sqlite/helpers/sqlite-helper'

SQLiteHelper.connect(env.dbFilename).then(async () => {
  const app = (await import ('./config/app')).default

  app.listen(env.port, () => {
    console.log(`Server running at http://localhost:${env.port}`)
  })
}).catch(console.error)
