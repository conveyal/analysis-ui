// @flow
import fetch from '@conveyal/woonerf/fetch'
import {connect} from 'react-redux'

import CopyTimetableModal from '../components/modification/copy-timetable'
import * as select from '../selectors'

function mapStateToProps (state, ownProps) {
  return {
    currentModification: select.activeModification(state, ownProps),
    currentProject: select.currentProject(state, ownProps),
    currentRegionId: select.currentRegionId(state, ownProps)
  }
}

const getTimetables = next =>
  fetch({url: '/api/timetables', next})

export default connect(mapStateToProps, {getTimetables})(CopyTimetableModal)
