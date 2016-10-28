/** Show a regional analysis on the map */

import {connect} from 'react-redux'
import RegionalComparisonLayer from '../components/map/regional-comparison'

function mapStateToProps ({ analysis, project }) {
  return {
    // TODO hack
    scenarioGrid: analysis.regional.grid || { data: [], width: 0, height: 0, north: 0, south: 0, zoom: 9 },
    baseGrid: analysis.regional.comparisonGrid || { data: [], width: 0, height: 0, north: 0, south: 0, zoom: 9 },
    probabilityGrid: analysis.regional.probabilityGrid || { data: [], width: 0, height: 0, north: 0, south: 0, zoom: 9 },
    minimumImprovementProbability: analysis.regional.minimumImprovementProbability
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(RegionalComparisonLayer)
