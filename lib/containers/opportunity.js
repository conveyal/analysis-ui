/**
 * Container for drawing opportunity data on the map.
 */

import {connect} from 'react-redux'

import {Choropleth, ReactChoropleth} from 'gridualizer'
// TODO state stored outside redux is bad
import {getGrids} from '../utils/browsochrones'

function mapStateToProps () {
  return {
    grid: getGrids().get('Jobs_total'),
    breaks: Choropleth.quantile
  }
}

const mapDispatchToProps = () => new Object()

export default connect(mapStateToProps, mapDispatchToProps)(ReactChoropleth)
