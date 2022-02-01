import { SQLiteHelper as sut } from './sqlite-helper'

describe('SQLiteHelper', () => {
  beforeAll(async () => {
    await sut.connect()
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  test('Should return false if connection is closed', async () => {
    sut.client.close()

    const promise = sut.isConnected()
    await expect(promise).resolves.toBe(false)
  })

  test('Should reconnect if sqlite is down', async () => {
    let files = await sut.getCollection('files')
    expect(files).toBeTruthy()

    await sut.disconnect()
    files = await sut.getCollection('files')
    expect(files).toBeTruthy()
  })

  test('getOne should return falsy if data is not found', async () => {
    await sut.deleteAll('files')
    const file = await sut.getOne('files', 'any_id')

    expect(file).toBeFalsy()
  })
})

describe('SQLiteHelper', () => {
  test('Should throw error if createDb throws', async () => {
    const promise = sut.createDb(':invalid:')

    await expect(promise).rejects.toThrow()
    sut.client = null
  })

  test('Should call prepareDb reconnecting', async () => {
    expect(sut.client).toBeNull()
    const connectSpy = jest.spyOn(sut, 'connect')
    await sut.prepareDb()

    expect(connectSpy).toHaveBeenCalled()
    await sut.disconnect()
  })

  test('Should call deleteAll reconnecting', async () => {
    expect(sut.client).toBeNull()
    const connectSpy = jest.spyOn(sut, 'connect')
    await sut.deleteAll('files')

    expect(connectSpy).toHaveBeenCalled()
    await sut.disconnect()
  })

  test('Should call insertOne reconnecting', async () => {
    expect(sut.client).toBeNull()
    const connectSpy = jest.spyOn(sut, 'connect')
    await sut.insertOne('files', {})

    expect(connectSpy).toHaveBeenCalled()
    await sut.disconnect()
  })

  test('Should call getOne reconnecting', async () => {
    expect(sut.client).toBeNull()
    const connectSpy = jest.spyOn(sut, 'connect')
    await sut.getOne('files', 'any_id')

    expect(connectSpy).toHaveBeenCalled()
    await sut.disconnect()
  })

  test('Should call getOneWhere reconnecting', async () => {
    expect(sut.client).toBeNull()
    const connectSpy = jest.spyOn(sut, 'connect')
    await sut.getOneWhere('subtitles', { fieldName: 'file_id', id: 'any_id' })

    expect(connectSpy).toHaveBeenCalled()
    await sut.disconnect()
  })
})
