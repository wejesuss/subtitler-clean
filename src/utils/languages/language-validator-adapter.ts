import { LanguageValidator } from '../../presentation/protocols/language-validator'
import parsedLanguages from './languages.json'

interface Languages {
  [K: string]: string
}

export class LanguageValidatorAdapter implements LanguageValidator {
  private readonly _languages: Languages

  constructor () {
    this._languages = parsedLanguages
  }

  isValid (language: string): boolean {
    const found = Object.keys(this._languages).includes(language)

    return found
  }
}
