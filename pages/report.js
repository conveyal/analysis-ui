import {loadProjectAndModifications} from 'lib/actions/project'
import Report from 'lib/components/report'

Report.getInitialProps = async ctx => {
  const store = ctx.reduxStore
  const {projectId, index} = ctx.query
  const {bundle, feeds, modifications, project} = await store.dispatch(
    loadProjectAndModifications(projectId)
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
