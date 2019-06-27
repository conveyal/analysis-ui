import get from 'lodash/get'
import Cookie from 'js-cookie'
import React from 'react'
import {AttributionControl, Map as LeafletMap, ZoomControl} from 'react-leaflet'
import {useSelector} from 'react-redux'

import useRouteChanging from 'lib/hooks/use-route-changing'
import selectModificationSaveInProgress from 'lib/selectors/modification-save-in-progress'
import selectRegionBounds from 'lib/selectors/region-bounds'

import Geocoder from './geocoder'
import MapboxGLLayer from './mapbox-gl'

const VIEWPORT_KEY = 'analysis-map-viewport'
const DEFAULT_VIEWPORT = {
  center: [38, -77],
  zoom: 12
}

export default function Map(p) {
  const [viewport, setViewport] = React.useState(() =>
    Cookie.getJSON(VIEWPORT_KEY)
  )
  const leafletMapRef = React.useRef()
  const regionBounds = useSelector(selectRegionBounds)
  const saveInProgress = useSelector(selectModificationSaveInProgress)
  const [routeChanging] = useRouteChanging()

  React.useEffect(() => {
    let watchId = false
    if (!viewport && navigator in window) {
      watchId = navigator.geolocation.getCurrentPosition(function(p) {
        setViewport({
          ...viewport,
          center: [p.coords.latitude, p.coords.longitude]
        })
      })
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId)
    }
  }, [viewport])

  // Share the leaflet map
  const getMap = () => get(leafletMapRef, 'current.leafletElement')

  return (
    <div className={routeChanging || saveInProgress ? 'disableAndDim' : ''}>
      <LeafletMap
        attributionControl={false}
        onViewportChanged={v => Cookie.set(VIEWPORT_KEY, v, {expires: 365})}
        maxBounds={regionBounds}
        preferCanvas={true}
        ref={leafletMapRef}
        viewport={viewport || DEFAULT_VIEWPORT}
        zoomControl={false}
      >
        <MapboxGLLayer />

        <AttributionControl position='bottomright' prefix={false} />
        <ZoomControl position='topright' />

        {!routeChanging && p.children ? p.children : null}
      </LeafletMap>

      <Geocoder getMap={getMap} />
    </div>
  )
}
