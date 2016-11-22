/**
 A miniature map used in reports.
 Comes with a basemap out-of-the-box, and additional react-leaflet elements may be added as children
 NB the maps do not include attribution, we put it on the report as a whole.
 */

import React, { Component } from 'react'
import {Map as LeafletMap, TileLayer} from 'react-leaflet'
import {Browser} from 'leaflet'
import messages from '../../utils/messages'

export default class MiniMap extends Component {
  render () {
    // TODO auto-rotate map when bounds are significantly north-south

    let {width = 720, height = 200, bounds, children} = this.props

    let scaledWidth = (bounds.getEast() - bounds.getWest()) * Math.cos(bounds.getNorth() * Math.PI / 180)
    let boundsHeight = bounds.getNorth() - bounds.getSouth()

    let rotated = boundsHeight / scaledWidth > 1.2

    // slightly prefer keeping north at the top
    if (!rotated) {
      return <div>
        <div className='MiniMap-northArrow'><i className='fa fa-arrow-up' />&nbsp;{messages.map.northAbbr}</div>
        {this.renderMap({ width, height, bounds, children })}
      </div>
    } else {
      return <div style={{width, height}}>
        <div className='MiniMap-northArrow'><i className='fa fa-arrow-left' />&nbsp;{messages.map.northAbbr}</div>
        {/* default rotate origin is at the bottom so translate it back into position   */}
        <div style={{transform: `rotate(-90deg) translate(${width - height}px)`}}>
          {this.renderMap({ width: height, height: width, bounds, children })}
        </div>
      </div>
    }
  }

  renderMap = ({width, height, bounds, children}) => {
    return <div style={{width: width, height: height}}>
      <LeafletMap bounds={bounds}
        zoomControl={false}
        attributionControl={false}
        keyboard={false}
        dragging={false}
        touchZoom={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        boxZoom={false}
        >
        <TileLayer
          url={Browser.retina ? process.env.LEAFLET_RETINA_URL : process.env.LEAFLET_TILE_URL}
          />
        {children}
      </LeafletMap>
    </div>
  }
}
