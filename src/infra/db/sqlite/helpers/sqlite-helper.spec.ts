import { SQLiteHelper as sut } from './sqlite-helper'

describe('SQLiteHelper', () => {
  test('Should throw error if createDb throws', async () => {
    const promise = sut.createDb(':invalid:')

    await expect(promise).rejects.toThrow()
  })
})
