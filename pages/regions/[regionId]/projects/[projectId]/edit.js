import {loadProject} from 'lib/actions/project'
import EditProject from 'lib/components/edit-project'
import MapLayout from 'lib/layouts/map'
import withInitialFetch from 'lib/with-initial-fetch'

const EditProjectPage = withInitialFetch(EditProject, async (store, query) => {
  return {project: await store.dispatch(loadProject(query.projectId))}
})

EditProjectPage.Layout = MapLayout

export default EditProjectPage
