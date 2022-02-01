import { exec } from 'child_process'
import { randomBytes } from 'crypto'
import { basename, dirname, extname, resolve as resolvePath } from 'path'
import { CreateVideoFromAudioStorage } from '../../../../data/protocols/create-video-from-audio-storage'

export class CreateVideoLocalStorage implements CreateVideoFromAudioStorage {
  private readonly inputImage: string

  constructor (inputImage: string) {
    this.inputImage = inputImage
  }

  private createCommand (inputImage: string, inputAudio: string, outputVideo: string): string {
    let command = 'ffmpeg -r 1 -loop 1 '
    command += `-i "${inputImage}" `
    command += `-i "${inputAudio}" -c:a copy `
    command += `-r 1 -shortest -vf scale=1280:720 "${outputVideo}"`

    return command
  }

  async create (path: string): Promise<string> {
    const ext = extname(path)
    const filename = basename(path, ext)
    const random = randomBytes(4).toString('hex')
    const videoPath = resolvePath(dirname(path), `${filename}-${random}.mp4`)
    const command = this.createCommand(this.inputImage, path, videoPath)

    return await new Promise((resolve, reject) => {
      exec(command, {}, (error) => {
        if (error) {
          reject(error)
        }

        resolve(videoPath)
      })
    })
  }
}
