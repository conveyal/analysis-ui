// @flow
import {connect} from 'react-redux'

import Report from '../components/report'
import {load as loadProject} from '../actions/project'
import {load as loadRegion} from '../actions/region'
import selectAllModificationFeedIds from '../selectors/all-modification-feed-ids'
import selectCurrentBundle from '../selectors/current-bundle'
import selectFeedScopedStops from '../selectors/feed-scoped-stops'
import selectModifications from '../selectors/modifications'
import selectProjectTimetables from '../selectors/project-timetables'
import selectVariants from '../selectors/variants'

function mapStateToProps (state, props) {
  const {project} = state
  let {projectId, regionId, variantId} = props.params
  const variants = selectVariants(state, props)
  variantId = parseInt(variantId)
  const modifications = selectModifications(state, props)
  return {
    allFeedIds: selectAllModificationFeedIds(state, props),
    modifications: modifications.filter(m => m.variants[variantId]),
    projectId,
    regionId,
    project: project.currentProject,
    variant: variants[variantId],
    bundle: selectCurrentBundle(state, props),
    feedsById: project.feedsById,
    projectTimetables: project.feedsById
      ? selectProjectTimetables(state)
      : [],
    feedScopedStops: project.feedsById
      ? selectFeedScopedStops(state)
      : []
  }
}

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    loadProject: id => dispatch(loadProject(id)),
    loadRegion: id => dispatch(loadRegion(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Report)
