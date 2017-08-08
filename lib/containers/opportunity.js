/**
 * Container for drawing opportunity data on the map.
 */

import {classifiers} from '@conveyal/gridualizer'
import {connect} from 'react-redux'

import colors from '../constants/colors'
import Gridualizer from '../components/map/gridualizer'

function mapStateToProps ({ analysis, project }) {
  const grid = analysis.destinationGrid || { zoom: 0, width: 0, height: 0, north: 0, west: 0, data: [] }
  const classifier = classifiers.diverging({scheme: classifiers.quantile})
  const breaks = classifier(grid, colors.REGIONAL_COMPARISON_GRADIENT.length)
  return {
    // pass in an empty grid if no grid is loaded, so this component can be added to the map
    // without needing to synchronize with the grid loading, and then just be updated when the
    // grid loads
    breaks: breaks,
    classifier,
    grid,
    color: process.env.OPPORTUNITY_COLOR
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Gridualizer)
