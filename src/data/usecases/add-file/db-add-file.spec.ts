import { DbAddFile } from './db-add-file'

interface SutTypes {
  sut: DbAddFile
}

const makeSut = (): SutTypes => {
  const sut = new DbAddFile()

  return {
    sut
  }
}

describe('DbAddFile Usecase', () => {
  test('Should call DbAddFile with correct values', async () => {
    const { sut } = makeSut()
    const addSpy = jest.spyOn(sut, 'add')
    const fileData = {
      filename: 'valid_filename',
      path: 'valid_path',
      size: 1073741824
    }

    await sut.add(fileData)
    expect(addSpy).toHaveBeenCalledWith(fileData)
  })
})
