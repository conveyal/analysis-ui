//
import React, {PureComponent} from 'react'
import {GeoJSON} from 'react-leaflet'
import uuid from 'uuid'

export default class Patterns extends PureComponent {
  render() {
    const {color, patterns} = this.props
    const geometry = {
      type: 'FeatureCollection',
      features: patterns.map(pat => {
        return {
          type: 'Feature',
          geometry: pat.geometry
        }
      })
    }

    return <GeoJSON data={geometry} color={color} key={uuid.v4()} weight={3} />
  }
}
