import L from 'leaflet'
import {} from 'mapbox-gl-leaflet'
import {GridLayer, withLeaflet} from 'react-leaflet'

const accessToken = process.env.MAPBOX_ACCESS_TOKEN
const attribution = `© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>`
const defaultStyle = 'mapbox/light-v10'
const getStyle = (style = defaultStyle) => `mapbox://styles/${style}`

class MapBoxGLLayer extends GridLayer {
  componentDidUpdate() {
    this.leafletElement._glMap.resize()
  }

  createLeafletElement(props) {
    return L.mapboxGL({
      accessToken,
      attribution,
      style: getStyle(props.style)
    })
  }
}

export default withLeaflet(MapBoxGLLayer)
