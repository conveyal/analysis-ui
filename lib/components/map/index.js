import Cookie from 'js-cookie'
import React from 'react'
import {useSelector} from 'react-redux'
import {AttributionControl, Map as LeafletMap, ZoomControl} from 'react-leaflet'

import useRouteChanging from 'lib/hooks/use-route-changing'
import selectModificationSaveInProgress from 'lib/selectors/modification-save-in-progress'
import selectModificationBounds from 'lib/selectors/modification-bounds'
import selectRegionBounds from 'lib/selectors/region-bounds'

import MapboxGLLayer from './mapbox-gl'

const CENTER_KEY = 'lastMapCenter'
const DEFAULT_ZOOM = 12
const MIN_ZOOM = 2

function useSelectBounds() {
  const modificationBounds = useSelector(selectModificationBounds)
  const regionBounds = useSelector(selectRegionBounds)

  return modificationBounds || regionBounds
}

function useMapCenter(bounds) {
  const boundsCenter = bounds && bounds.getCenter()
  const cookieCenter = Cookie.getJSON(CENTER_KEY)
  const [browserPosition, setBrowserPosition] = React.useState()
  React.useEffect(() => {
    let watchId = false
    if (navigator in window) {
      watchId = navigator.geolocation.getCurrentPosition(function(p) {
        setBrowserPosition([p.coords.latitude, p.coords.longitude])
      })
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId)
    }
  }, [setBrowserPosition])

  return boundsCenter || cookieCenter || browserPosition
}

export default function Map(p) {
  const bounds = useSelectBounds()
  const saveInProgress = useSelector(selectModificationSaveInProgress)
  const [routeChanging] = useRouteChanging()
  const center = useMapCenter(bounds)

  return (
    <LeafletMap
      attributionControl={false}
      bounds={bounds}
      center={center}
      className={routeChanging || saveInProgress ? 'disableAndDim' : ''}
      minZoom={MIN_ZOOM}
      onMoveend={e => {
        const c = e.target.getCenter()
        Cookie.set(CENTER_KEY, [c.lat, c.lng], {expires: 365})
      }}
      preferCanvas={true}
      zoom={DEFAULT_ZOOM}
      zoomControl={false}
      zoomDelta={0.5}
      zoomSnap={0.5}
    >
      <MapboxGLLayer />

      <AttributionControl position='bottomright' prefix={false} />
      <ZoomControl position='topright' />

      {!routeChanging && p.children ? p.children : null}
    </LeafletMap>
  )
}
