import lonlat from '@conveyal/lonlat'

import {PROJECTION_ZOOM_LEVEL} from 'lib/constants'

export default function calculateGridPoints(
  bounds: CL.Bounds,
  zoom = PROJECTION_ZOOM_LEVEL
): number {
  const topLeft = lonlat.toPixel([bounds.west, bounds.north], zoom)
  const bottomRight = lonlat.toPixel([bounds.east, bounds.south], zoom)
  const width = topLeft.x - bottomRight.x
  const height = topLeft.y - bottomRight.y
  return width * height
}
