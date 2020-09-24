import {loadBundles} from 'lib/actions'
import {getForProject as loadModifications} from 'lib/actions/modifications'
import {loadProject, loadProjects} from 'lib/actions/project'
import {loadRegion} from 'lib/actions/region'
import List from 'lib/components/modification/list'
import ProjectTitle from 'lib/components/project-title'
import SelectProject from 'lib/components/select-project'
import MapLayout from 'lib/layouts/map'
import withInitialFetch from 'lib/with-initial-fetch'

const noProjectId = (pid) => !pid || pid === 'undefined'

/**
 * Show Select Project if a project has not been selected
 */
const ModificationsPage: any = withInitialFetch(
  ({bundles, modifications, project, projects, region}) => {
    if (!project) {
      return (
        <SelectProject bundles={bundles} projects={projects} region={region} />
      )
    } else {
      return (
        <>
          <ProjectTitle project={project} />
          <List modifications={modifications} project={project} />
        </>
      )
    }
  },
  async (dispatch, query) => {
    const {projectId, regionId} = query
    if (noProjectId(projectId)) {
      const [region, bundles, projects] = await Promise.all([
        dispatch(loadRegion(regionId)),
        dispatch(loadBundles({regionId})),
        dispatch(loadProjects({regionId}))
      ])
      return {bundles, projects, region}
    } else {
      const [project, modifications] = await Promise.all([
        dispatch(loadProject(projectId)),
        dispatch(loadModifications(projectId))
      ])
      return {project, modifications}
    }
  }
)

ModificationsPage.Layout = MapLayout

export default ModificationsPage
