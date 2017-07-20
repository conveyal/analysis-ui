// @flow
import React, {PureComponent} from 'react'
import GeoJSON from 'react-leaflet/lib/GeoJSON'
import uuid from 'uuid'

import type {Pattern} from '../../types'

type Props = {
  color: string,
  patterns: Pattern[]
}

export default class Patterns extends PureComponent<void, Props, void> {
  render () {
    const {color, patterns} = this.props
    const geometry = {
      type: 'FeatureCollection',
      features: patterns.map((pat) => {
        return {
          type: 'Feature',
          geometry: pat.geometry
        }
      })
    }

    return <GeoJSON
      data={geometry}
      color={color}
      key={uuid.v4()}
      weight={3}
      />
  }
}
