/** Choose bookmarked single point settings */

import {connect} from 'react-redux'

import {fetchIsochrone, selectBookmark} from '../actions/analysis'
import {createBookmark} from '../actions/project'
import BookmarkChooser from '../components/analysis/bookmark-chooser'

function mapStateToProps (state) {
  const { project, analysis, scenario } = state
  return {
    bookmarks: project.currentProject.bookmarks,
    isochroneLonLat: analysis.isochroneLonLat,
    isFetchingIsochrone: analysis.isFetchingIsochrone,
    profileRequest: analysis.profileRequest,
    bundleId: scenario.currentBundle.id,
    isochroneCutoff: analysis.isochroneCutoff,
    modifications: scenario.modifications.filter(m => m.variants[analysis.activeVariant]),
    workerVersion: project.currentProject.r5Version,
    scenarioId: scenario.currentScenario.id,
    variantIndex: analysis.activeVariant,
    accessibility: analysis.accessibility,
    currentIndicator: analysis.currentIndicator,
    comparisonScenarioId: analysis.comparisonScenarioId,
    comparisonVariant: analysis.comparisonVariant,
    comparisonBundleId: analysis.comparisonBundleId,
    comparisonModifications: analysis.comparisonModifications,
    comparisonInProgress: analysis.comparisonInProgress,
    projectId: project.currentProject.id
  }
}

function mapDispatchToProps (dispatch) {
  return {
    fetchIsochrone: (req) => dispatch(fetchIsochrone({ ...req, dispatch })),
    selectBookmark: (bookmark) => dispatch(selectBookmark(bookmark)),
    createBookmark: (bookmark) => dispatch(createBookmark(bookmark))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookmarkChooser)
