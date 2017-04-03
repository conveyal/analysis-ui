import {connect} from 'react-redux'

import EditBounds from '../components/map/edit-bounds'
import {setRegionalAnalysisBounds} from '../actions/analysis/regional'

function mapStateToProps (state, props) {
  return {
    bounds: state.analysis.regional.bounds
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    save: (bounds) => dispatch(setRegionalAnalysisBounds(bounds))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditBounds)
