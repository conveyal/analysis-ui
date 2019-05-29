import {loadBundles} from 'lib/actions'
import CreateProject from 'lib/containers/create-project'

CreateProject.getInitialProps = async ctx => {
  await ctx.reduxStore.dispatch(loadBundles({regionId: ctx.query.regionId}))
}

export default CreateProject
