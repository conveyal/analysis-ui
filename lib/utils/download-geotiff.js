// @flow
export default function downloadGeoTIFF ({
  data,
  filename
}: {
  data: Object,
  filename: string
}) {
  try {
    const blob = new Blob([data], {type: 'image/tiff'})
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
