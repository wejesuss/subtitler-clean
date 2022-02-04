import { Request, Response, Router } from 'express'
import { Auth } from 'googleapis'
import env from '../../config/env'
import { adaptRoute } from '../../adapters/express-route-adapter'
import { makeCreateSubtitleController } from '../../factories/create-subtitle'
import { makeDownloadSubtitleController } from '../../factories/download-subtitle'
import { OAuth2Client } from 'google-auth-library'

const inputImage = env.inputImage
const OAuthClient = makeOAuthClient()
getConsentUrl(OAuthClient)

function makeOAuthClient (): OAuth2Client {
  const OAuthClient = new Auth.OAuth2Client({
    clientId: env.clientId,
    clientSecret: env.clientSecret,
    redirectUri: env.redirectUri
  })

  return OAuthClient
}

function getConsentUrl (OAuthClient: OAuth2Client): void {
  const url = OAuthClient.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/youtube',
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.force-ssl',
      'https://www.googleapis.com/auth/youtubepartner'
    ]
  })

  console.log('Give your consent:\n')
  console.log(url)
}

function getConsent (req: Request, res: Response): any {
  const code = req.query.code

  if (code && typeof code === 'string') {
    if (
      OAuthClient.credentials.access_token &&
      OAuthClient.credentials.refresh_token
    ) {
      return res.send('consent already given')
    }

    OAuthClient.getToken(code, (err, token) => {
      if (err) {
        return res.send('error')
      }

      OAuthClient.setCredentials(token)
      res.send('ok, close this tab now')
    })
  } else {
    res.redirect('/')
  }
}

export default (router: Router): void => {
  router.get('/subtitle/credentials', getConsent)
  router.post(
    '/create-subtitle',
    adaptRoute(makeCreateSubtitleController(inputImage, OAuthClient))
  )
  router.get(
    '/download-subtitle',
    adaptRoute(makeDownloadSubtitleController(inputImage, OAuthClient))
  )
}
