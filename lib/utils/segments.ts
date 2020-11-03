import flatMap from 'lodash/flatMap'

export function flatten(
  segments: CL.ModificationSegment[]
): GeoJSON.Position[] {
  return flatMap(segments, (s) =>
    s.geometry.type === 'LineString'
      ? s.geometry.coordinates
      : [s.geometry.coordinates]
  )
}
