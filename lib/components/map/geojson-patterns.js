// @flow
import React, {PureComponent} from 'react'
import {GeoJson} from 'react-leaflet'
import uuid from 'uuid'

import type {Pattern} from '../../types'

type Props = {
  color: string,
  patterns: Pattern[]
}

export default class Patterns extends PureComponent<void, Props, void> {
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
