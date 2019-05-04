import getFeedsRoutesAndStops from 'lib/actions/get-feeds-routes-and-stops'
import {loadModification} from 'lib/actions/modifications'
import {loadProject} from 'lib/actions/project'
import {ADD_TRIP_PATTERN} from 'lib/constants'
import ModificationEditor from 'lib/containers/modification-editor'

ModificationEditor.getInitialProps = async ctx => {
  const {modificationId, projectId} = ctx.query
  const store = ctx.reduxStore
  const state = store.getState()

  // TODO check if project and feed are already loaded
  const project = await store.dispatch(loadProject(projectId))

  // Always reload the modification to get recent changes
  const modification = await store.dispatch(loadModification(modificationId))

  // Only load feeds for modifications that have them
  let feeds = []
  if (modification.type !== ADD_TRIP_PATTERN) {
    feeds = await store.dispatch(
      getFeedsRoutesAndStops({
        bundleId: project.bundleId,
        modifications: [modification]
      })
    )
  }

  return {
    feeds,
    modification,
    project,
    regionId: project.regionId
  }
}

export default ModificationEditor
