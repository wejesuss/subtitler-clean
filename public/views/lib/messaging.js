const result = document.querySelector('.result')
const loading = result.querySelector('.loading')
const error = result.querySelector('.error')
const response = result.querySelector('.success')

export function createMapErroName () {
  const mapErrorName = new Map()
  mapErrorName.set('MissingParamError', 'Parâmetro não enviado: Verifique se esqueceu algo')
  mapErrorName.set('InvalidParamError', 'Parâmetro inválido: Tem certeza que está correto?')
  mapErrorName.set('NotFoundError', 'Recurso não encontrado: Talvez ainda não esteja pronto ou foi apagado')
  mapErrorName.set('ServerError', 'Erro inesperado no servidor, tente novamente mais tarde')

  return mapErrorName
}

export function showThreeDotsLoading () {
  let dots = 0
  return setInterval(() => {
    if (dots > 3) dots = 0

    const dotsStr = '.'.repeat(dots)
    showLoading(`Enviando, aguarde${dotsStr}`)

    dots++
  }, 500)
}

export function showLoading (message) {
  loading.textContent = message
}

export function showResult (message) {
  response.textContent = message
}

export function showError (message) {
  error.textContent = message
}

export function resetMessages () {
  showError('')
  showLoading('')
  showResult('')
}
