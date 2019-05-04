import {loadBundle} from 'lib/actions'
import {loadProject} from 'lib/actions/project'
import EditProject from 'lib/components/edit-project'

EditProject.getInitialProps = async ctx => {
  const project = await ctx.reduxStore.dispatch(
    loadProject(ctx.query.projectId)
  )
  const bundle = await ctx.reduxStore.dispatch(loadBundle(project.bundleId))
  return {bundleName: bundle.name, project}
}

export default EditProject
