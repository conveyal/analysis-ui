import {getForProject as loadModifications} from 'lib/actions/modifications'
import {loadProject} from 'lib/actions/project'
import List from 'lib/components/modification/list'
import ProjectTitle from 'lib/components/project-title'
import MapLayout from 'lib/layouts/map'
import withInitialFetch from 'lib/with-initial-fetch'

/**
 * Show Select Project if a project has not been selected
 */
const ModificationsPage: any = withInitialFetch(
  ({modifications, project}) => (
    <>
      <ProjectTitle project={project} />
      <List modifications={modifications} project={project} />
    </>
  ),
  async (dispatch, query) => {
    const [project, modifications] = await Promise.all([
      dispatch(loadProject(query.projectId)),
      dispatch(loadModifications(query.projectId))
    ])
    return {project, modifications}
  }
)

ModificationsPage.Layout = MapLayout

export default ModificationsPage
