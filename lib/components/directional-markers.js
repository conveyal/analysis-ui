// @flow
import lonlat from '@conveyal/lonlat'
import {GridLayer} from 'leaflet'
import {MapLayer} from 'react-leaflet'

import {getBearingAndCoordinatesAlongLine} from '../utils/markers'
import type {Bounds, LonLatBearing, Pattern, Point} from '../types'

type Props = {
  color: string,
  patterns: Pattern[]
}

type State = {
  z: number,
  markers: LonLatBearing[]
}

const TZ = 256 // tile size
const LINE_WIDTH = 2
const LINE_LENGTH = 9
const EARTH_CIRCUMFERENCE_METERS = 40000000

// Spacing depends on the zoom level
function getSpacingMeters (z: number): number {
  // We want a marker every 125px or so at the equator
  const tileSizeM = EARTH_CIRCUMFERENCE_METERS / Math.pow(2, z)
  return 0.5 * tileSizeM
}

export default class DirectionalMarkers extends MapLayer {
  props: Props
  state: State

  state = {
    z: 12,
    markers: undefined
  }

  createLeafletElement () {
    const gridLayer = new GridLayer()
    gridLayer.createTile = this.createTile
    return gridLayer
  }

  componentDidUpdate (prevProps: Props) {
    if (prevProps.patterns !== this.props.patterns) {
      this.setState({markers: undefined})
      this.leafletElement.redraw()
    }
  }

  /**
   * Side effects! Saves the markers that have been created for this pattern.
   */
  _getMarkersForZoom (z: number) {
    let markers = this.state.markers
    if (!markers || this.state.z !== z) {
      markers = getDirectionalMarkersForPatterns(this.props.patterns, z)
      this.setState({markers, z})
    }
    return markers
  }

  createTile = (coords: {x: number, y: number, z: number}) => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = TZ
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.strokeStyle = this.props.color
      ctx.lineWidth = LINE_WIDTH
      drawTile(this._getMarkersForZoom(coords.z), ctx, coords, coords.z)
    }

    return canvas
  }
}

function drawTile (
  markers: LonLatBearing[],
  ctx: CanvasRenderingContext2D,
  tile: Point,
  z: number
) {
  drawMarkersInTile(markers, tile, z, ({x, y}, bearing) => {
    // we know they're in the current tile so we can be lazy and just modulo
    x %= TZ
    y %= TZ

    // center it up
    x -= 1
    y -= 1

    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(bearing * Math.PI / 180)
    ctx.moveTo(-LINE_LENGTH, LINE_LENGTH)
    ctx.lineTo(0, 0)
    ctx.lineTo(LINE_LENGTH, LINE_LENGTH)
    ctx.stroke()
    ctx.restore()
  })
}

export function getDirectionalMarkersForPatterns (patterns: Pattern[], z: number) {
  return patterns.reduce((markers, p) => [
    ...markers,
    ...getBearingAndCoordinatesAlongLine(
      p.geometry.coordinates,
      getSpacingMeters(z)
    )
  ], [])
}

export function drawMarkersInTile (
  markers: LonLatBearing[],
  tile: Point,
  z: number,
  draw: (marker: Point, bearing: number) => void
) {
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

function markerToPixel (marker: LonLatBearing, z: number): Point {
  return lonlat.toPixel(marker, z)
}

function markerInTile (m: Point, tb: Bounds): boolean {
  return m.x > tb.west && m.x < tb.east && m.y > tb.north && m.y < tb.south
}
