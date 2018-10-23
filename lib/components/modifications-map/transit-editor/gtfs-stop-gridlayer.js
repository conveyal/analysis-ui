// @flow
import lonlat from '@conveyal/lonlat'
import Leaflet from 'leaflet'
import {MapLayer} from 'react-leaflet'

import {MINIMUM_SNAP_STOP_ZOOM_LEVEL} from '../../../constants'
import colors from '../../../constants/colors'
import type {GTFSStop} from '../../../types'

type Props = {
  stops: GTFSStop[]
}

/**
 * An optimized layer for drawing stops rapidly, adapted from
 * https://github.com/conveyal/leaflet-transit-editor/blob/master/lib/stop-layer.js
 */
export default class GTFSStopGridLayer extends MapLayer {
  props: Props

  createLeafletElement () {
    const gridLayer = new Leaflet.GridLayer()
    gridLayer.createTile = this.createTile
    return gridLayer
  }

  shouldComponentUpdate (nextProps: Props) {
    return nextProps.stops !== this.props.stops
  }

  componentDidUpdate () {
    this.leafletElement.redraw()
  }

  createTile = (coords: {x: number, y: number, z: number}) => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 256
    this.drawTile(canvas, coords, coords.z)
    return canvas
  }

  drawTile = (
    cvs: HTMLCanvasElement,
    tilePt: {x: number, y: number},
    z: number
  ) => {
    const {stops} = this.props
    const ctx = cvs.getContext('2d')
    if (z >= MINIMUM_SNAP_STOP_ZOOM_LEVEL && ctx) {
      ctx.strokeStyle = colors.NEUTRAL
      // get the bounds
      const topLeft = lonlat.fromPixel({
        x: tilePt.x * 256,
        y: tilePt.y * 256
      }, z)
      const botRight = lonlat.fromPixel({
        x: (tilePt.x + 1) * 256,
        y: (tilePt.y + 1) * 256
      }, z)
      const stopWithinBounds = s =>
        s.stop_lat < topLeft.lat &&
        s.stop_lat > botRight.lat &&
        s.stop_lon > topLeft.lon &&
        s.stop_lon < botRight.lon
      const drawStopToCanvas = s => {
        // get coordinates
        let {x, y} = lonlat.toPixel([s.stop_lat, s.stop_lon], z)

        // we know they're in the current tile so we can be lazy and just modulo
        x %= 256
        y %= 256

        // center it up
        x -= 1
        y -= 1

        ctx.beginPath()
        ctx.arc(x, y, 2, 0, Math.PI * 2)
        ctx.stroke()
      }

      // find relevant stops and draw them
      stops.filter(stopWithinBounds).forEach(drawStopToCanvas)
    }
  }
}
