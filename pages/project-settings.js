import {load} from '../lib/actions/project'
import EditProject from '../lib/containers/edit-project'

EditProject.getInitialProps = async ctx => {
  await ctx.reduxStore.dispatch(load(ctx.query.projectId))
}

export default EditProject
