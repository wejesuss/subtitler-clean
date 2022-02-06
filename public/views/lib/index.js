import { createMapErroName, resetMessages, showError, showResult, showThreeDotsLoading } from './messaging.js'
const form = document.querySelector('form')

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
      resetMessages()

      if (res.error) {
        const mapErrorName = createMapErroName()
        const mappedError = mapErrorName.get(res.name)

        return showError(mappedError || res.error)
      }

      const id = res.id
      showResult(`Enviado com sucesso! Guarde seu id: ${id}`)
    })
    .catch((reason) => {
      resetMessages()
      showError(reason.message || reason)
    })

  return false
})
