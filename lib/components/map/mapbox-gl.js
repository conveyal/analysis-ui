import L from 'leaflet'
import {} from 'mapbox-gl-leaflet'
import {GridLayer, withLeaflet} from 'react-leaflet'

const accessToken = process.env.MAPBOX_ACCESS_TOKEN
const defaultStyle = 'mapbox/light-v10'
const getStyle = (style = defaultStyle) => `mapbox://styles/${style}`

class MapBoxGLLayer extends GridLayer {
  createLeafletElement(props) {
    return L.mapboxGL({accessToken, style: getStyle(props.style)})
  }
}

export default withLeaflet(MapBoxGLLayer)
