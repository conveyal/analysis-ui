// @flow
import fetch from '@conveyal/woonerf/fetch'
import {connect} from 'react-redux'

import {addComponent, removeComponent, setCenter} from '../actions/map'
import {
  create,
  deleteLocally,
  deleteRegion,
  load,
  save,
  setLocally
} from '../actions/region'
import EditRegion from '../components/edit-region'
import {EDIT_REGION_BOUNDS_COMPONENT} from '../constants/map'
import {CREATING_ID, DEFAULT_BOUNDS} from '../constants/region'

import selectCurrentRegion from '../selectors/current-region'

function mapStateToProps (state, ownProps) {
  const region = selectCurrentRegion(state, ownProps)
  return {
    region: region || {
      _id: CREATING_ID,
      bounds: DEFAULT_BOUNDS
    }
  }
}

function mapDispatchToProps (dispatch: Dispatch, {params}) {
  return {
    addComponentToMap: () =>
      dispatch(addComponent(EDIT_REGION_BOUNDS_COMPONENT)),
    create: opts => dispatch(create(opts)),
    clearUncreatedRegion: () => dispatch(deleteLocally(CREATING_ID)),
    deleteRegion: () => dispatch(deleteRegion(params.regionId)),
    fetch: opts => dispatch(fetch(opts)),
    removeComponentFromMap: () =>
      dispatch(removeComponent(EDIT_REGION_BOUNDS_COMPONENT)),
    save: opts => dispatch(save(opts)),
    setCenter: c => dispatch(setCenter(c)),
    setLocally: p => dispatch(setLocally(p)),
    load: _id => dispatch(load(_id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditRegion)
