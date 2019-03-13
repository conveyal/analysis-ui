import React from 'react'
import {GeoJSON as RLGeoJSON} from 'react-leaflet'
import uuid from 'uuid'

// Props are memoized, RLGeoJSON layer will be completely replaced with new data
export default class GeoJSON extends React.PureComponent {
  render () {
    return <RLGeoJSON key={uuid.v4()} {...this.props} />
  }
}
