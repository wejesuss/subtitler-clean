const form = document.querySelector('form')
const result = document.querySelector('.result')
const loading = result.querySelector('.loading')
const error = result.querySelector('.error')
const response = result.querySelector('.id')

function createMapErroName () {
  const mapErrorName = new Map()
  mapErrorName.set('MissingParamError', 'Parâmetro não enviado: Verifique se esqueceu algo')
  mapErrorName.set('InvalidParamError', 'Parâmetro inválido: Tem certeza que está correto?')
  mapErrorName.set('ServerError', 'Erro inesperado no servidor, tente novamente mais tarde')

  return mapErrorName
}

function showThreeDotsLoading () {
  let dots = 0
  return setInterval(() => {
    if (dots > 3) dots = 0

    const dotsStr = '.'.repeat(dots)
    showLoading(`Enviando, aguarde${dotsStr}`)

    dots++
  }, 500)
}

function showLoading (message) {
  loading.textContent = message
}

function showResult (message) {
  response.textContent = message
}

function showError (message) {
  error.textContent = message
}

function resetMessages () {
  showError('')
  showLoading('')
  showResult('')
}

form.addEventListener('submit', (e) => {
  e.preventDefault()
  resetMessages()

  const formData = new FormData(form)
  const file = formData.get('media-file')
  const language = formData.get('language')

  if (!file || (!file.type.includes('audio') && !file.type.includes('video'))) {
    resetMessages()
    showError('Você não selecionou um tipo de arquivo válido')
    return false
  }

  if (!language) {
    resetMessages()
    showError('Você não selecionou uma língua')
    return false
  }

  const intervalId = showThreeDotsLoading()

  fetch('/api/upload', {
    method: 'POST',
    body: formData
  })
    .then((res) => {
      clearInterval(intervalId)
      return res.json()
    })
    .then((res) => {
      if (res.error) {
        const mapErrorName = createMapErroName()
        const mapError = mapErrorName.get(res.name)

        resetMessages()
        return showError(mapError || res.error)
      }

      const id = res.id
      resetMessages()
      showResult(`Enviado com sucesso! Guarde seu id: ${id}`)
    })
    .catch((reason) => {
      resetMessages()
      showError(reason.message || reason)
    })

  return false
})
