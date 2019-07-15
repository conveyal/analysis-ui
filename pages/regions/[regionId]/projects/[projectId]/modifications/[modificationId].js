import {loadBundle} from 'lib/actions'
import getFeedsRoutesAndStops from 'lib/actions/get-feeds-routes-and-stops'
import {loadModification} from 'lib/actions/modifications'
import {loadProject} from 'lib/actions/project'
import ModificationEditor from 'lib/containers/modification-editor'
import withInitialFetch from 'lib/with-initial-fetch'

async function initialFetch(store, query) {
  const {modificationId, projectId} = query

  // TODO check if project and feed are already loaded
  const [project, modification] = await Promise.all([
    store.dispatch(loadProject(projectId)),
    // Always reload the modification to get recent changes
    store.dispatch(loadModification(modificationId))
  ])

  // Only gets unloaded feeds for modifications that have them
  const [bundle, feeds] = await Promise.all([
    store.dispatch(loadBundle(project.bundleId)),
    store.dispatch(
      getFeedsRoutesAndStops({
        bundleId: project.bundleId,
        modifications: [modification]
      })
    )
  ])

  return {
    bundle,
    feeds,
    modification,
    project
  }
}

export default withInitialFetch(ModificationEditor, initialFetch, {
  clientOnly: true
})
