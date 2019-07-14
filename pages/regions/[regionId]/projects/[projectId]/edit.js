import {loadBundle} from 'lib/actions'
import {loadProject} from 'lib/actions/project'
import EditProject from 'lib/components/edit-project'
import withInitialFetch from 'lib/with-initial-fetch'

async function initialFetch(store, query) {
  const project = await store.dispatch(loadProject(query.projectId))
  const bundle = await store.dispatch(loadBundle(project.bundleId))
  return {bundleName: bundle.name, project}
}

export default withInitialFetch(EditProject, initialFetch)
