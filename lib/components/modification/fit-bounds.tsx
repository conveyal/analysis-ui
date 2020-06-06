import {faExpand} from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import {useLeaflet} from 'react-leaflet'
import {useSelector} from 'react-redux'

import selectModificationBounds from 'lib/selectors/modification-bounds'

import IconTip from '../icon-tip'

export default function FitBounds() {
  const leaflet = useLeaflet()
  const bounds = useSelector(selectModificationBounds)
  const [fitBoundsTriggered, setFitBoundsTriggered] = React.useState(0)

  // Zoom to bounds on a trigger or bounds change
  React.useEffect(() => {
    if (fitBoundsTriggered !== 0) {
      if (bounds) {
        leaflet.map.fitBounds(bounds)
      }
    }
  }, [bounds, leaflet, fitBoundsTriggered])

  return (
    <IconTip
      className='pull-right'
      id='zoom-to-modification'
      onClick={() => setFitBoundsTriggered(Date.now())}
      tip='Fit map to modification extents'
      icon={faExpand}
    />
  )
}
