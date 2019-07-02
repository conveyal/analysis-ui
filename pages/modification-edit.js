import getFeedsRoutesAndStops from 'lib/actions/get-feeds-routes-and-stops'
import {loadModification} from 'lib/actions/modifications'
import {loadProject} from 'lib/actions/project'
import ModificationEditor from 'lib/containers/modification-editor'
import withFetch from 'lib/with-fetch'

async function fetchData(dispatch, query) {
  const {modificationId, projectId} = query

  // TODO check if project and feed are already loaded
  const [project, modification] = await Promise.all([
    dispatch(loadProject(projectId)),
    // Always reload the modification to get recent changes
    dispatch(loadModification(modificationId))
  ])

  // Only gets unloaded feeds for modifications that have them
  const feeds = await dispatch(
    getFeedsRoutesAndStops({
      bundleId: project.bundleId,
      modifications: [modification]
    })
  )

  return {
    feeds,
    modification,
    project
  }
}

export default withFetch(ModificationEditor, fetchData)
