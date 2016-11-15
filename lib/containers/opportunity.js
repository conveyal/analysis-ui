/**
 * Container for drawing opportunity data on the map.
 */

import {connect} from 'react-redux'

import {Choropleth, ReactChoropleth} from '@conveyal/gridualizer'
// TODO state stored outside redux is bad
import {getGrids} from '../utils/browsochrones'

function mapStateToProps ({ analysis, project }) {
  return {
    // TODO don't duplicate grid selection logic here and in SinglePointAnalysis
    grid: getGrids().get(analysis.currentIndicator || project.currentProject.indicators[0].key),
    breaks: Choropleth.quantile({ noDataValue: 0 }),
    colors: ['#feebe2', '#fbb4b9', '#f768a1', '#c51b8a', '#7a0177'],
    labels: 16
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ReactChoropleth)
