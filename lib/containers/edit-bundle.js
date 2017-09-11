import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import {deleteBundle, saveBundle} from '../actions'
import getFeedRoutesAndStops from '../actions/get-feeds-routes-and-stops'
import EditBundle from '../components/edit-bundle'

function mapStateToProps (state, props) {
  const {scenario} = state
  const {params} = props
  const {bundleId, projectId} = params
  const {bundles} = scenario
  const bundle = bundles.find(b => b.id === bundleId)
  return {
    bundle,
    bundleId,
    feeds: scenario.feeds,
    name: bundle && bundle.name,
    projectId
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    deleteBundle: () => [
      dispatch(deleteBundle(props.params.bundleId)),
      dispatch(push(`/projects/${props.params.projectId}/bundles`))
    ],
    fetchFeeds: opts => dispatch(getFeedRoutesAndStops({
      bundleId: props.params.bundleId,
      forceCompleteUpdate: true
    })),
    saveBundle: (...args) => dispatch(saveBundle(...args))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditBundle)
