/** Show a regional analysis on the map */

import {connect} from 'react-redux'
import colors from '../constants/colors'

import {ReactChoropleth} from '@conveyal/gridualizer'

function mapStateToProps ({ analysis, project }) {
  return {
    // TODO hack
    grid: analysis.regional.grid || { data: [], width: 0, height: 0, north: 0, south: 0, zoom: 9 },
    breaks: analysis.regional.breaks,
    colors: colors.REGIONAL_ANALYSIS,
    labels: 16
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ReactChoropleth)
