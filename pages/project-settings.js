import {load} from 'lib/actions/project'
import EditProject from 'lib/components/edit-project'

EditProject.getInitialProps = async ctx => {
  const {bundle, project} = await ctx.reduxStore.dispatch(
    load(ctx.query.projectId)
  )
  return {bundleName: bundle.name, project}
}

export default EditProject
