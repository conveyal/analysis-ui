// @flow
import {Polyline} from 'leaflet'
import React, {PureComponent} from 'react'
import {EditControl} from 'react-leaflet-draw'

import type {Feature} from '../../types'

type Props = {
  activateOnMount?: boolean,
  onPolygon: (Feature) => void
}

export default class DrawPolygon extends PureComponent {
  props: Props

  componentDidMount () {
    if (this.props.activateOnMount) {
      // this is not the react way of doing things, but it is the most upvoted
      // answer on GIS StackExchange:
      // https://gis.stackexchange.com/questions/238528/how-to-enable-a-leaflet-draw-tool-programatically
      const polygonButton = document.querySelector('.leaflet-draw-draw-polygon')
      if (polygonButton) polygonButton.click()
    }
  }

  render () {
    return (
      <EditControl
        draw={{
          polyline: false,
          polygon: true,
          rectangle: false,
          circle: false,
          marker: false
        }}
        position='bottomright'
        onCreated={this._onCreated}
      />
    )
  }

  _onCreated = (e: Event & {layer: Polyline}) => {
    this.props.onPolygon(e.layer.toGeoJSON())
  }
}
