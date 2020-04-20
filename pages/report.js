import {loadProjectAndModifications} from 'lib/actions/project'
import Report from 'lib/components/report'
import withInitialFetch from 'lib/with-initial-fetch'

async function initialFetch(store, query) {
  const {projectId, index} = query
  const {bundle, feeds, modifications, project} = await store.dispatch(
    loadProjectAndModifications(projectId)
  )

  return {
    bundle,
    feeds,
    modifications: modifications.filter((m) => m.variants[index]),
    project,
    variant: project.variants[index]
  }
}

export default withInitialFetch(Report, initialFetch)
