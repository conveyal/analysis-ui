// @flow
import {connect} from 'react-redux'

import Report from '../components/report'
import {load as loadProject} from '../actions/project'
import {load as loadRegion} from '../actions/region'
import * as select from '../selectors'

function mapStateToProps (state, props) {
  const {project} = state
  let {projectId, regionId, variantId} = props.params
  const variants = select.variants(state, props)
  variantId = parseInt(variantId)
  const modifications = select.modifications(state, props)
  return {
    allFeedIds: select.allModificationFeedIds(state, props),
    modifications: modifications.filter(m => m.variants[variantId]),
    projectId,
    regionId,
    project: project.currentProject,
    variant: variants[variantId],
    bundle: select.currentBundle(state, props),
    feedsById: project.feedsById,
    projectTimetables: project.feedsById
      ? select.projectTimetables(state)
      : [],
    feedScopedStops: project.feedsById
      ? select.feedScopedStops(state)
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
