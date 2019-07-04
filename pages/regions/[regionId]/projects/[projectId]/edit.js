import {loadBundle} from 'lib/actions'
import {loadProject} from 'lib/actions/project'
import EditProject from 'lib/components/edit-project'
import withFetch from 'lib/with-fetch'

async function fetchData(dispatch, query) {
  const project = await dispatch(loadProject(query.projectId))
  const bundle = await dispatch(loadBundle(project.bundleId))
  return {bundleName: bundle.name, project}
}

export default withFetch(EditProject, fetchData)
