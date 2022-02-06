import { createMapErroName, resetMessages, showError, showResult, showThreeDotsLoading } from './messaging.js'
const form = document.querySelector('form')
const dlink = document.getElementById('download-button')

function resetAllMessages () {
  resetMessages()
  showDownloadButton('')
}

function showDownloadButton (content = 'Baixar') {
  dlink.textContent = content
}

function setDownloadButon (captions = '') {
  const blob = new Blob([captions], { type: 'application/octect-stream' })
  showDownloadButton()
  dlink.href = window.URL.createObjectURL(blob)
  dlink.onclick = function () {
    const that = this
    setTimeout(function () {
      window.URL.revokeObjectURL(that.href)
    }, 1500)
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault()
  resetAllMessages()

  const formData = new FormData(form)
  const id = formData.get('id')

  if (!id || typeof id !== 'string') {
    resetAllMessages()
    showError('Você não preencheu o id do arquivo')
    return false
  }

  const intervalId = showThreeDotsLoading()

  fetch(`/api/download-subtitle/${id}`, {
    method: 'GET'
  })
    .then((res) => {
      clearInterval(intervalId)
      return res.json()
    })
    .then((res) => {
      resetAllMessages()

      if (res.error) {
        const mapErrorName = createMapErroName()
        const mappedError = mapErrorName.get(res.name)

        return showError(mappedError || res.error)
      }

      setDownloadButon(res.captions)
      showResult('Sua legenda está pronta, clique no botão abaixo para baixar')
    })
    .catch((reason) => {
      clearInterval(intervalId)
      resetAllMessages()
      showError(reason.message || reason)
    })

  return false
})
