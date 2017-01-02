/** Show a regional analysis on the map */

import {connect} from 'react-redux'
import RegionalComparisonLayer from '../components/map/regional-comparison'

function mapStateToProps ({ analysis, project }) {
  return {
    // TODO hack
    differenceGrid: analysis.regional.differenceGrid || { data: [], width: 0, height: 0, north: 0, west: 0, zoom: 9 },
    probabilityGrid: analysis.regional.probabilityGrid || { data: [], width: 0, height: 0, north: 0, west: 0, zoom: 9 },
    minimumImprovementProbability: analysis.regional.minimumImprovementProbability,
    breaks: analysis.regional.breaks
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(RegionalComparisonLayer)
