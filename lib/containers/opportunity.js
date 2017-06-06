/**
 * Container for drawing opportunity data on the map.
 */

import {connect} from 'react-redux'

import {ReactDot} from '@conveyal/gridualizer'

function mapStateToProps ({ analysis, project }) {
  return {
    // pass in an empty grid if no grid is loaded, so this component can be added to the map
    // without needing to synchronize with the grid loading, and then just be updated when the
    // grid loads
    grid: analysis.destinationGrid || { zoom: 0, width: 0, height: 0, north: 0, west: 0, data: [] },
    color: process.env.OPPORTUNITY_COLOR
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ReactDot)
