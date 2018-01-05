// @flow
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'

import {setActiveTrips} from '../actions'
import ConvertToFrequency from '../components/modification/convert-to-frequency'
import * as select from '../selectors'

export default connect(createStructuredSelector({
  allPhaseFromTimetableStops: select.allPhaseFromTimetableStops,
  feeds: select.feedsWithBundleNames,
  feedScopedModificationStops: select.feedScopedModificationStops,
  projectTimetables: select.projectTimetables,
  routePatterns: select.routePatterns,
  selectedFeed: select.modificationFeed
}), {setActiveTrips})(ConvertToFrequency)
