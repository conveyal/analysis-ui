import getFeedsRoutesAndStops from 'lib/actions/get-feeds-routes-and-stops'
import {loadModification} from 'lib/actions/modifications'
import {loadProject} from 'lib/actions/project'
import ModificationEditor from 'lib/containers/modification-editor'

ModificationEditor.getInitialProps = async ctx => {
  const {modificationId, projectId} = ctx.query
  const store = ctx.reduxStore

  // TODO check if project and feed are already loaded
  const [project, modification] = await Promise.all([
    store.dispatch(loadProject(projectId)),
    // Always reload the modification to get recent changes
    store.dispatch(loadModification(modificationId))
  ])

  // Only gets unloaded feeds for modifications that have them
  const feeds = await store.dispatch(
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

export default ModificationEditor
