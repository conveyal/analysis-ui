import {load as loadProject} from 'lib/actions/project'
import Report from 'lib/components/report'

Report.getInitialProps = async ctx => {
  const store = ctx.reduxStore
  const {projectId, regionId, index} = ctx.query
  const {bundle, feeds, modifications, project} = await store.dispatch(
    loadProject(projectId)
  )

  return {
    bundle,
    feeds,
    modifications: modifications.filter(m => m.variants[index]),
    project,
    variant: project.variants[index]
  }
}

export default Report
