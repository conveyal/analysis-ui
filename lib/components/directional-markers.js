import lonlat from '@conveyal/lonlat'
import memoize from 'memoize-one'
import {GridLayer, withLeaflet} from 'react-leaflet'

import {getBearingAndCoordinatesAlongLine} from '../utils/markers'

const TZ = 256 // tile size
const LINE_WIDTH = 2
const LINE_LENGTH = 9
const EARTH_CIRCUMFERENCE_METERS = 40000000

// Spacing depends on the zoom level
function getSpacingMeters(z) {
  // We want a marker every 125px or so at the equator
  const tileSizeM = EARTH_CIRCUMFERENCE_METERS / Math.pow(2, z)
  return 0.5 * tileSizeM
}

// Memoize for when arguments don't change
const getMarkers = memoize(getDirectionalMarkersForPatterns)

function createCreateTile(props) {
  return function createTile(coords) {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = TZ
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.strokeStyle = props.color
      ctx.lineWidth = LINE_WIDTH
      drawTile(getMarkers(props.patterns, coords.z), ctx, coords, coords.z)
    }

    return canvas
  }
}

export class DirectionalMarkers extends GridLayer {
  createLeafletElement(props) {
    const gridLayer = super.createLeafletElement(props)
    gridLayer.createTile = createCreateTile(props)
    return gridLayer
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.patterns !== this.props.patterns
  }

  componentDidUpdate() {
    this.leafletElement.createTile = createCreateTile(this.props)
    this.leafletElement.redraw()
  }
}

// Add leaflet to the props
export default withLeaflet(DirectionalMarkers)

function drawTile(markers, ctx, tile, z) {
  drawMarkersInTile(markers, tile, z, ({x, y}, bearing) => {
    // we know they're in the current tile so we can be lazy and just modulo
    x %= TZ
    y %= TZ

    // center it up
    x -= 1
    y -= 1

    ctx.save()
    ctx.translate(x, y)
    ctx.rotate((bearing * Math.PI) / 180)
    ctx.moveTo(-LINE_LENGTH, LINE_LENGTH)
    ctx.lineTo(0, 0)
    ctx.lineTo(LINE_LENGTH, LINE_LENGTH)
    ctx.stroke()
    ctx.restore()
  })
}

export function getDirectionalMarkersForPatterns(patterns, z) {
  return patterns.reduce(
    (markers, p) => [
      ...markers,
      ...getBearingAndCoordinatesAlongLine(
        p.geometry.coordinates,
        getSpacingMeters(z)
      )
    ],
    []
  )
}

export function drawMarkersInTile(markers, tile, z, draw) {
  const tileBounds = {
    north: tile.y * TZ,
    south: (tile.y + 1) * TZ,
    west: tile.x * TZ,
    east: (tile.x + 1) * TZ
  }

  for (const marker of markers) {
    const mp = markerToPixel(marker, z)
    if (markerInTile(mp, tileBounds)) draw(mp, marker.bearing)
  }
}

function markerToPixel(marker, z) {
  return lonlat.toPixel(marker, z)
}

function markerInTile(m, tb) {
  return m.x > tb.west && m.x < tb.east && m.y > tb.north && m.y < tb.south
}
