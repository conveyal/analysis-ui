import lonlat from '@conveyal/lonlat'
import get from 'lodash/get'
import Cookie from 'js-cookie'
import React from 'react'
import {AttributionControl, Map as LeafletMap, ZoomControl} from 'react-leaflet'
import {useSelector} from 'react-redux'
import Select from 'react-select/async'

import useRouteChanging from 'lib/hooks/use-route-changing'
import selectModificationSaveInProgress from 'lib/selectors/modification-save-in-progress'
import selectModificationBounds from 'lib/selectors/modification-bounds'
import selectRegionBounds from 'lib/selectors/region-bounds'
import mapboxSearch from 'lib/utils/mapbox-search'

import {selectStyles} from '../select'

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
  const [center, setCenter] = React.useState(boundsCenter || cookieCenter)

  React.useEffect(() => {
    let watchId = false
    if (!center && navigator in window) {
      watchId = navigator.geolocation.getCurrentPosition(function(p) {
        setCenter([p.coords.latitude, p.coords.longitude])
      })
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId)
    }
  }, [center, setCenter])

  return [center, setCenter]
}

const geocoderStyle = {
  position: 'absolute',
  top: '10px',
  left: '10px',
  width: '296px',
  zIndex: '1000'
}

function Geocoder(p) {
  function panToResult(r) {
    if (r) p.map.panTo([r.center[1], r.center[0]])
  }

  function searchWithProximity(t, callback) {
    mapboxSearch(
      t,
      {
        proximity: lonlat.toString(p.map.getCenter())
      },
      callback
    )
  }

  return (
    <div style={geocoderStyle}>
      <Select
        getOptionLabel={f => get(f, 'place_name')}
        getOptionValue={f => get(f, 'id')}
        loadOptions={searchWithProximity}
        onChange={panToResult}
        placeholder='Search...'
        styles={selectStyles}
      />
    </div>
  )
}

export default function Map(p) {
  const bounds = useSelectBounds()
  const leafletMapRef = React.useRef()
  const saveInProgress = useSelector(selectModificationSaveInProgress)
  const [routeChanging] = useRouteChanging()
  const [center, setCenter] = useMapCenter(bounds)

  // Share the leaflet map
  const leafletMap = get(leafletMapRef, 'current.leafletElement')

  return (
    <div className={routeChanging || saveInProgress ? 'disableAndDim' : ''}>
      <LeafletMap
        attributionControl={false}
        bounds={bounds}
        center={center}
        minZoom={MIN_ZOOM}
        onMoveend={e => {
          const c = e.target.getCenter()
          setCenter(c)
          Cookie.set(CENTER_KEY, [c.lat, c.lng], {expires: 365})
        }}
        preferCanvas={true}
        ref={leafletMapRef}
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

      {leafletMap && <Geocoder map={leafletMap} />}
    </div>
  )
}
