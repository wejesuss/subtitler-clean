import childProcess from 'child_process'
import path from 'path'
import { CreateVideoLocalStorage } from './video'

const makeFakeCommand = (inputImage: string, inputAudio: string): string => {
  const ext = path.extname(inputAudio)
  const filename = path.basename(inputAudio, ext)
  const random = 'abcdef'
  const outputVideo = path.resolve(path.dirname(inputAudio), `${filename}-${random}.mp4`)

  let command = 'ffmpeg -r 1 -loop 1 '
  command += `-i "${inputImage}" `
  command += `-i "${inputAudio}" -c:a copy `
  command += `-r 1 -shortest -vf scale=1280:720 "${outputVideo}"`

  return command
}

const makeSut = (): CreateVideoLocalStorage => {
  return new CreateVideoLocalStorage(inputImage)
}

const inputImage = path.resolve(__dirname, 'input.jpg')
const audioPath = path.resolve(__dirname, 'test.mp3')

describe('Create Video LocalStorage', () => {
  test('Should throw on failure', async () => {
    const createVideoLocalStorage = makeSut()
    jest.spyOn(Buffer.prototype, 'toString').mockReturnValueOnce('abcdef')
    const execSpy = jest.spyOn(childProcess, 'exec').mockImplementationOnce((_command, _options, callback) => {
      callback(new Error(), '', '')
      return null
    })

    const promise = createVideoLocalStorage.create(audioPath)

    await expect(promise).rejects.toEqual(new Error())
    expect(execSpy).toHaveBeenCalledWith(makeFakeCommand(inputImage, audioPath), {}, expect.anything())
  })

  test('Should save video to disk on success', async () => {
    const createVideoLocalStorage = makeSut()
    jest.spyOn(Buffer.prototype, 'toString').mockReturnValueOnce('abcdef')
    const execSpy = jest.spyOn(childProcess, 'exec').mockImplementationOnce((_command, _options, callback) => {
      callback(null, '', '')
      return null
    })

    const videoPath = path.resolve(__dirname, 'test-abcdef.mp4')
    const promise = createVideoLocalStorage.create(audioPath)

    await expect(promise).resolves.toBe(videoPath)
    expect(execSpy).toHaveBeenCalledWith(makeFakeCommand(inputImage, audioPath), {}, expect.anything())
  })
})
