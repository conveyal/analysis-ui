import React, { Component } from 'react'
import {GeoJson} from 'react-leaflet'
import uuid from 'uuid'

export class Patterns extends Component {
  shouldComponentUpdate (nextProps) {
    return nextProps.patterns !== this.props.patterns || nextProps.color !== this.props.color
  }

  render () {
    const { color, patterns } = this.props
    const geometry = {
      type: 'FeatureCollection',
      features: patterns.map((pat) => {
        return {
          type: 'Feature',
          geometry: pat.geometry
        }
      })
    }

    return <GeoJson
      data={geometry}
      color={color}
      weight={3}
      key={uuid.v4()}
      />
  }
}
