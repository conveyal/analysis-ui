import {load as loadProject} from 'lib/actions/project'
import {load as loadRegion} from 'lib/actions/region'
import {Application, Dock} from 'lib/components/application'
import ProjecTitle from 'lib/components/project-title'
import ImportModifications from 'lib/components/import-modifications'

function ImportModificationsPage(p) {
  return (
    <Application>
      <ProjectTitle project={p.project} />
      <Dock>
        <ImportModifications projectId={p.projectId} regionId={p.regionId} />
      </Dock>
    </Application>
  )
}

ImportModificationsPage.getInitialProps = async ctx => {
  const store = ctx.reduxStore
  const {regionId, projectId} = ctx.query
  const {projects} = await store.dispatch(loadRegion(regionId))
  const project = await store.dispatch(loadProject(projectId))
  return {
    project,
    projects: projects.filter(p => p._id !== projectId),
    regionId
  }
}

export default ImportModificationsPage
