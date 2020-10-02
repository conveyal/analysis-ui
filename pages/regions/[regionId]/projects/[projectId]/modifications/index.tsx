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
    const results = await Promise.all([
      dispatch(loadModifications(query.projectId)),
      dispatch(loadProject(query.projectId))
    ])
    return {
      modifications: results[0],
      project: results[1]
    }
  }
)

ModificationsPage.Layout = MapLayout

export default ModificationsPage
