export default function downloadData(data, filename, type) {
  try {
    const blob = new Blob([data], {type})
    const a = document.createElement('a')
    a.setAttribute('href', URL.createObjectURL(blob))
    a.setAttribute('target', '_blank')
    a.setAttribute('download', filename)
    a.click()
  } catch (e) {
    window.alert(`Can not download filename:\n${e.message}`)
    throw e
  }
}
