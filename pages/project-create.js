import {loadBundles} from 'lib/actions'
import CreateProject from 'lib/components/create-project'

CreateProject.getInitialProps = async ctx => {
  const bundles = await ctx.reduxStore.dispatch(
    loadBundles({regionId: ctx.query.regionId})
  )
  return {bundles}
}

export default CreateProject
