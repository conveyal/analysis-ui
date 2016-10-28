/** Show a regional analysis on the map */

import {connect} from 'react-redux'

import {Choropleth, ReactChoropleth} from '@conveyal/gridualizer'

function mapStateToProps ({ analysis, project }) {
  return {
    // TODO hack
    grid: analysis.regional.grid || { data: [], width: 0, height: 0, north: 0, south: 0, zoom: 9 },
    breaks: Choropleth.equal({ noDataValue: 0 }),
    // blues from Colorbrewer
    colors: ['#f1eef6', '#bdc9e1', '#74a9cf', '#2b8cbe', '#045a8d'],
    labels: 16
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ReactChoropleth)
