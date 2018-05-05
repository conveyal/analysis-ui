import {connect} from 'react-redux'

import CopyTimetableModal from '../components/modification/copy-timetable'
import * as select from '../selectors'

function mapStateToProps (state, ownProps) {
  return {
    currentModification: select.activeModification(state, ownProps),
    currentProject: select.currentProject(state, ownProps),
    currentRegionId: select.currentRegionId(state, ownProps),
    regions: select.regions(state, ownProps)
  }
}

export default connect(mapStateToProps, {})(CopyTimetableModal)
