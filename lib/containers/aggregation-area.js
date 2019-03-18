// @flow

/** Display an aggregation area as an outline on the map */

import {GeoJSON} from 'react-leaflet'
import {connect} from 'react-redux'

import selectAggregationArea from '../selectors/aggregation-area'

function mapStateToProps (state, params) {
  return {
    data: selectAggregationArea(state) || {type: 'FeatureCollection', features: []}
  }
}

export default connect(mapStateToProps, {})(GeoJSON)
