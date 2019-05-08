//
import {Browser} from 'leaflet'
import React from 'react'
import {TileLayer} from 'react-leaflet'

const DEFAULT_ZINDEX = 40

const mapboxConveyalUrl = 'https://api.mapbox.com/styles/v1/conveyal'
const labelUrl = `${mapboxConveyalUrl}/ciw80szsa000f2qme51ki2kku/tiles/256/{z}/{x}/{y}`
const retinaUrl = `${labelUrl}@2x`
const URL = Browser.retina
  ? `${retinaUrl}?access_token=${process.env.MAPBOX_ACCESS_TOKEN}`
  : `${labelUrl}?access_token=${process.env.MAPBOX_ACCESS_TOKEN}`

export default function LabelLayer({zIndex = DEFAULT_ZINDEX}) {
  return URL ? <TileLayer zIndex={zIndex} url={URL} /> : <g />
}
