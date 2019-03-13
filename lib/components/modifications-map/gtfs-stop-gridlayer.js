// @flow
import lonlat from '@conveyal/lonlat'
import {GridLayer, withLeaflet} from 'react-leaflet'

import {MINIMUM_SNAP_STOP_ZOOM_LEVEL} from '../../constants'
import colors from '../../constants/colors'
import type {Bounds, GTFSStop, Point} from '../../types'

type Props = {
  stops: GTFSStop[]
}

const TZ = 256 // size of a tile
const SR = 2 // stop radius

/**
 * An optimized layer for drawing stops rapidly, adapted from
 * https://github.com/conveyal/leaflet-transit-editor/blob/master/lib/stop-layer.js
 */
export class GTFSStopGridLayer extends GridLayer {
  props: Props

  createLeafletElement (props) {
    const gridLayer = super.createLeafletElement(props)
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
    canvas.width = canvas.height = TZ
    this.drawTile(canvas, coords, coords.z)
    return canvas
  }

  drawTile (cvs: HTMLCanvasElement, tile: Point, z: number) {
    const ctx = cvs.getContext('2d')
    if (z >= MINIMUM_SNAP_STOP_ZOOM_LEVEL && ctx) {
      ctx.strokeStyle = colors.NEUTRAL
      drawStopsInTile(this.props.stops, tile, z, (s) => {
        const offset = SR / 2
        ctx.beginPath()
        // In the current tile, so modulo by the tile size and center it
        ctx.arc(s.x % TZ - offset, s.y % TZ - offset, SR, 0, Math.PI * SR)
        ctx.stroke()
      })
    }
  }
}

// Add leaflet element
export default withLeaflet(GTFSStopGridLayer)

/**
 * Convert stops to pixel coordinates, check if they are within the tile bounds
 * and then call the draw function on the stop. Created in this style for test.
 */
export function drawStopsInTile (
  stops: GTFSStop[],
  tile: Point,
  z: number,
  draw: (stop: Point) => void
) {
  const tileBounds = {
    north: tile.y * TZ,
    south: (tile.y + 1) * TZ,
    west: tile.x * TZ,
    east: (tile.x + 1) * TZ
  }

  for (const stop of stops) {
    const sp = stopToPixel(stop, z)
    if (stopInTile(sp, tileBounds)) draw(sp)
  }
}

export function stopToPixel (stop: GTFSStop, z: number): Point {
  return lonlat.toPixel([stop.stop_lon, stop.stop_lat], z)
}

/**
 * A tile's x increases to the right and y increases down.
 */
export function stopInTile (s: Point, tb: Bounds): boolean {
  return s.x > tb.west && s.x < tb.east && s.y > tb.north && s.y < tb.south
}
