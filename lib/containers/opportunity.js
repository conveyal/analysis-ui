// @flow
import {classifiers} from '@conveyal/gridualizer'
import {connect} from 'react-redux'

import colors from '../constants/colors'
import Gridualizer from '../components/map/gridualizer'

function mapStateToProps ({analysis, project}) {
  // pass in an empty grid if no grid is loaded, so this component can be added
  // to the map without needing to synchronize with the grid loading, and then
  // just be updated when the grid loads
  const grid = analysis.destinationGrid || {
    zoom: 0,
    width: 0,
    height: 0,
    north: 0,
    west: 0,
    data: []
  }
  const classifier = classifiers.ckmeans({})
  const breaks = classifier(grid, colors.REGIONAL_COMPARISON_GRADIENT.length)
  return {
    breaks,
    colors: colors.REGIONAL_COMPARISON_GRADIENT,
    grid
  }
}

/**
 * Container for drawing opportunity data on the map.
 */
export default connect(mapStateToProps, {})(Gridualizer)
