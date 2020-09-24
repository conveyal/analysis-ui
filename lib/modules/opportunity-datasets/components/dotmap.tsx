import get from 'lodash/get'
import {memo} from 'react'
import {useSelector} from 'react-redux'

import Gridualizer from 'lib/components/map/gridualizer'
import {activeOpportunityDatasetGrid} from '../selectors'

import createDrawTile from '../create-draw-tile'

/**
 * Container for drawing opportunity data on the map.
 */
let key = 0
export default memo(function Dotmap() {
  const grid = useSelector(activeOpportunityDatasetGrid)
  if (get(grid, 'data.length', 0) > 0) {
    return (
      <Gridualizer key={key++} drawTile={createDrawTile(grid)} zIndex={299} />
    )
  }
  return null
})
