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
    breaks: Choropleth.quantile,
    colors: ['#feebe2', '#fbb4b9', '#f768a1', '#c51b8a', '#7a0177']
  }
}

const mapDispatchToProps = () => new Object()

export default connect(mapStateToProps, mapDispatchToProps)(ReactChoropleth)
