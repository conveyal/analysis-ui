export default function downloadCSV(csv: string, filename: string) {
  try {
    const a = document.createElement('a')
    a.setAttribute(
      'href',
      'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
    )
    a.setAttribute('target', '_blank')
    a.setAttribute('download', filename + '.csv')
    a.click()
  } catch (e) {
    window.alert(`Could not download file:\n${e.message}`)
    throw e
  }
}
