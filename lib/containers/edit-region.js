import {connect} from 'react-redux'

import {setCenter} from 'lib/actions/map'
import {
  create,
  deleteLocally,
  deleteRegion,
  load,
  save,
  setLocally
} from 'lib/actions/region'
import EditRegion from 'lib/components/edit-region'

function mapDispatchToProps(dispatch, {query}) {
  return {
    create: opts => dispatch(create(opts)),
    deleteRegion: () => dispatch(deleteRegion(query.regionId)),
    save: opts => dispatch(save(opts)),
    setCenter: c => dispatch(setCenter(c)),
    setLocally: p => dispatch(setLocally(p)),
    load: _id => dispatch(load(_id))
  }
}

export default connect(
  null,
  mapDispatchToProps
)(EditRegion)
