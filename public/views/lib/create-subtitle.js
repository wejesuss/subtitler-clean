import { createMapErroName, resetMessages, showError, showResult, showThreeDotsLoading } from './messaging.js'
const form = document.querySelector('form')

form.addEventListener('submit', (e) => {
  e.preventDefault()
  resetMessages()

  const formData = new FormData(form)
  const id = formData.get('id')

  if (!id || typeof id !== 'string') {
    resetMessages()
    showError('Você não preencheu o id do arquivo')
    return false
  }

  const intervalId = showThreeDotsLoading()

  fetch('/api/create-subtitle', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id })
  })
    .then((res) => {
      clearInterval(intervalId)
      return res.json()
    })
    .then((res) => {
      if (res.error) {
        const mapErrorName = createMapErroName()
        const mappedError = mapErrorName.get(res.name)

        resetMessages()
        return showError(mappedError || res.error)
      }

      resetMessages()
      showResult(`Enviado com sucesso! Seu áudio/vídeo será legendado. Esse processo pode levar algumas horas. Lembre-se de guardar o seu id: ${id}`)
    })
    .catch((reason) => {
      resetMessages()
      showError(reason.message || reason)
    })

  return false
})
