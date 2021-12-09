import { File } from './file'

export interface FileValidator {
  isValid: (file: File) => boolean
}
