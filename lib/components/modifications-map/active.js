import React from 'react'
import {useLeaflet} from 'react-leaflet'
import {useSelector} from 'react-redux'

import selectModificationBounds from 'lib/selectors/modification-bounds'
import selectRoutePatterns from 'lib/selectors/route-patterns'

import Display from './display'

export default function ActiveDisplay({triggerFitBounds, ...p}) {
  const leaflet = useLeaflet()
  const bounds = useSelector(selectModificationBounds)
  const routePatterns = useSelector(selectRoutePatterns)
  const [currentRoutePatterns, setCurrentRoutePatterns] = React.useState(
    routePatterns
  )
  const [fitBoundsTriggered, setFitBoundsTriggered] = React.useState(
    triggerFitBounds
  )

  // Zoom to bounds on a trigger
  React.useEffect(() => {
    if (fitBoundsTriggered !== triggerFitBounds) {
      setFitBoundsTriggered(triggerFitBounds)
      if (bounds) {
        leaflet.map.fitBounds(bounds)
      }
    }
  }, [bounds, leaflet, triggerFitBounds, fitBoundsTriggered])

  // Zoom to bounds on a route change
  React.useEffect(() => {
    if (routePatterns !== currentRoutePatterns) {
      setCurrentRoutePatterns(routePatterns)
      if (bounds) {
        leaflet.map.fitBounds(bounds)
      }
    }
  }, [bounds, leaflet, currentRoutePatterns, routePatterns])

  return <Display {...p} />
}
