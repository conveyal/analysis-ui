// @flow
import React, {Component} from 'react'

import EditBounds from './edit-bounds'

import type {Bounds, Region} from '../../types'

export default class EditRegionBounds extends Component {
  props: {
    bounds: Bounds,
    isLoaded: boolean,
    region: Region,
    setLocally: (region: Region) => void
  }

  saveBounds = (bounds: Bounds) => {
    const {region, setLocally} = this.props
    setLocally({
      ...region,
      bounds
    })
  }

  render () {
    const {isLoaded, bounds} = this.props
    return isLoaded ? <EditBounds bounds={bounds} save={this.saveBounds} /> : <g />
  }
}
