// @flow
import React, {PureComponent} from 'react'
import {FeatureGroup} from 'react-leaflet'
import inside from '@turf/inside'
import {point} from '@turf/helpers'

import type {Feature, GTFSStop} from '../../types'

import DrawPolygon from './draw-polygon'
import GTFSStopGridLayer from './gtfs-stop-gridlayer'

type Props = {
  allStops: GTFSStop[],
  hopStops: GTFSStop[][],
  selectHops(string[][]): void
}

/**
 * Select stops using a polygon select
 */
export default class HopSelectPolygon extends PureComponent<void, Props, void> {
  render () {
    return (
      <g>
        <FeatureGroup>
          <DrawPolygon activateOnMount onPolygon={this._onPolygon} />
        </FeatureGroup>
        <GTFSStopGridLayer stops={this.props.allStops} />
      </g>
    )
  }

  _onPolygon = (polygon: Feature) => {
    const {hopStops, selectHops} = this.props
    selectHops(
      hopStops
        .filter(
          hop =>
            inside(point([hop[0].stop_lon, hop[0].stop_lat]), polygon) &&
            inside(point([hop[1].stop_lon, hop[1].stop_lat]), polygon)
        )
        .map(hop => [hop[0].stop_id, hop[1].stop_id])
    )
  }
}