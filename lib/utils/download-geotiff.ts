import downloadData from './download-data'

export default function downloadGeoTIFF({data, filename}) {
  downloadData(data, filename, 'image/tiff')
}
