/** Container for a report on a scenario */

import {connect} from 'react-redux'
import Report from '../report/index'
import {load} from '../actions/scenario'

function mapStateToProps (state, props) {
  let { scenario } = state
  let { scenarioId } = props.params
  return {
    modifications: scenario.modifications,
    scenarioId,
    feedsById: scenario.feedsById
  }
}

function mapDispatchToProps (dispatch) {
  return {
    load: (id) => dispatch(load(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Report)
