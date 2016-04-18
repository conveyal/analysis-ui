/** an optimized layer for drawing stops rapidly, adapted from https://github.com/conveyal/leaflet-transit-editor/blob/master/lib/stop-layer.js */

const MIN_ZOOM = 12 // don't draw stops below this zoom

import { BaseTileLayer } from 'react-leaflet'
import { point, TileLayer } from 'leaflet'

export default class StopLayer extends BaseTileLayer {
  static defaultProps = {
    minZoom: MIN_ZOOM
  }

  componentWillMount () {
    super.componentWillMount()
    this.leafletElement = new TileLayer.Canvas()
    this.leafletElement.drawTile = this.drawTile
  }

  drawTile = (cvs, tilePt, z) => {
    if (z < this.props.minZoom) return // don't draw every transit stop in a country

    let ctx = cvs.getContext('2d')
    ctx.strokeStyle = '#888'

    // get the bounds
    let topLeft = this.props.map.unproject([tilePt.x * 256, tilePt.y * 256], z)
    let brPoint = point([tilePt.x + 1, tilePt.y + 1])
    let botRight = this.props.map.unproject([brPoint.x * 256, brPoint.y * 256], z)

    // find relevant stops
    this.props.stops
      .filter((s) => s.stop_lat < topLeft.lat && s.stop_lat > botRight.lat && s.stop_lon > topLeft.lng && s.stop_lon < botRight.lng)
      .forEach((s) => {
        // get coordinates
        // lat first for leaflet, every so often Lineland seems like a good idea
        // http://www.gutenberg.org/ebooks/97
        let { x, y } = this.props.map.project([s.stop_lat, s.stop_lon], z)

        // we know they're in the current tile so we can be lazy and just modulo
        x %= 256
        y %= 256

        // center it up
        x -= 1
        y -= 1

        ctx.beginPath()
        ctx.arc(x, y, 2, 0, Math.PI * 2)
        ctx.stroke()
      })
  }
}
