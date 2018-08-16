// @flow

/** Display an aggregation area as an outline on the map */

import {connect} from 'react-redux'

import GeoJson from '../components/map/geojson'
import selectAggregationArea from '../selectors/aggregation-area'

function mapStateToProps (state, params) {
  return {
    data: selectAggregationArea(state) || {type: 'FeatureCollection', features: []}
  }
}

export default connect(mapStateToProps, {})(GeoJson)
