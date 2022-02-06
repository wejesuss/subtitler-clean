import { Express, Router } from 'express'
import fg from 'fast-glob'

export default (app: Express): void => {
  const apiRouter = Router()
  const uiRouter = Router()
  app.use('/', uiRouter)
  app.use('/api', apiRouter)

  fg.sync('**/src/main/routes/ui/**/**routes.ts').map(async (file) => {
    (await import(`../../../${file}`)).default(uiRouter)
  })

  fg.sync('**/src/main/routes/api/**/**routes.ts').map(async (file) => {
    (await import(`../../../${file}`)).default(apiRouter)
  })
}
