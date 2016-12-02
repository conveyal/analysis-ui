/**
 * Container for drawing opportunity data on the map.
 */

import {connect} from 'react-redux'

import {ReactDot} from '@conveyal/gridualizer'

function mapStateToProps ({ analysis, project }) {
  return {
    grid: analysis.grid,
    color: process.env.OPPORTUNITY_COLOR
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ReactDot)
