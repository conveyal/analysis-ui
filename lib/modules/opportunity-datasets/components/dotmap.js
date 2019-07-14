import {colorizers} from '@conveyal/gridualizer'
import React from 'react'
import {useSelector} from 'react-redux'

import Gridualizer from 'lib/components/map/gridualizer'
import {activeOpportunityDatasetGrid} from '../selectors'

const colorizer = colorizers.dot()

/**
 * Container for drawing opportunity data on the map.
 */
export default function Dotmap() {
  const grid = useSelector(activeOpportunityDatasetGrid)
  if (!grid) return null

  return <Gridualizer colorizer={colorizer} grid={grid} />
}
