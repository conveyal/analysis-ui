import React from 'react'

import {getBearingAndCoordinatesAlongLine} from '../utils/markers'
import {point, TileLayer} from 'leaflet'
import {BaseTileLayer} from 'react-leaflet'

export default class DirectionalMarkers extends BaseTileLayer {
  componentWillMount () {
    super.componentWillMount()
    this.leafletElement = new TileLayer.Canvas()
    this.leafletElement.drawTile = this.drawTile
  }

  componentWillReceiveProps () {
    this.currentZoom = this.markers = undefined
  }

  drawTile = (cvs, tilePt, z) => {
    // We want a marker every 125px or so at the equator
    let tileSizeM = 40000000 / Math.pow(2, z)
    let spacingMeters = 0.5 * tileSizeM

    // TODO use state?
    if (this.currentZoom !== z || this.markers === undefined) {
      this.markers = this.props.patterns
        .reduce((markers, pattern) => [...markers, ...getBearingAndCoordinatesAlongLine({ coordinates: pattern.geometry.coordinates, spacingMeters })], [])
    }

    const {map} = this.context

    const ctx = cvs.getContext('2d')
    ctx.strokeStyle = this.props.color
    ctx.lineWidth = 2
    // get the bounds
    const topLeft = map.unproject([tilePt.x * 256, tilePt.y * 256], z)
    const brPoint = point([tilePt.x + 1, tilePt.y + 1])
    const botRight = map.unproject([brPoint.x * 256, brPoint.y * 256], z)
    const markerWithinBounds = (m) => m.coordinates[1] < topLeft.lat && m.coordinates[1] > botRight.lat && m.coordinates[0] > topLeft.lng && m.coordinates[0] < botRight.lng
    const drawMarkerToCanvas = (m) => {
      // get coordinates
      // lat first for leaflet, every so often Lineland seems like a good idea
      // http://www.gutenberg.org/ebooks/97
      let { x, y } = map.project([m.coordinates[1], m.coordinates[0]], z)

      // we know they're in the current tile so we can be lazy and just modulo
      x %= 256
      y %= 256

      // center it up
      x -= 1
      y -= 1

      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(m.bearing * Math.PI / 180)
      ctx.moveTo(-9, 9)
      ctx.lineTo(0, 0)
      ctx.lineTo(9, 9)
      ctx.stroke()
      ctx.restore()
    }

    // find relevant stops and draw them
    this.markers
      .filter(markerWithinBounds)
      .forEach(drawMarkerToCanvas)
  }
}
