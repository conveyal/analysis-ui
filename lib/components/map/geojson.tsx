import {useState, useEffect} from 'react'
import {GeoJSON, GeoJSONProps} from 'react-leaflet'
import {v4 as uuid} from 'uuid'

/**
 * Increment the render count when the data or style changes to replace the entire underlying GeoJSON component.
 */
export default function KeyedGeoJSON({data, style, ...p}: GeoJSONProps) {
  const [key, setKey] = useState(() => uuid())
  useEffect(() => setKey(uuid()), [data, style])
  return <GeoJSON data={data || []} key={key} style={style} {...p} />
}
