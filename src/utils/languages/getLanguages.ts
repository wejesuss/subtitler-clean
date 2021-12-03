import languagesObj from './languages.json'

export class GetLanguages {
  private readonly _languages: typeof languagesObj

  public get languages (): typeof languagesObj {
    return this._languages
  }

  constructor () {
    this._languages = languagesObj
  }

  toList (): Array<{
    id: string
    name: string
  }> {
    const list = Object.entries(this._languages).map(([id, name]) => {
      return {
        id,
        name
      }
    })

    return list
  }

  verify (language: string): string | Error {
    const found = Object.keys(this._languages).find(value => value === language)

    if (found) {
      return this._languages[found]
    }

    return new Error('Provided language is not valid')
  }
}
