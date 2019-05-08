import {loadProjectAndModifications} from 'lib/actions/project'
import Modifications from 'lib/components/modification/list'

/**
 * Populates props with bundle, feeds, modifications, and project.
 */
Modifications.getInitialProps = async ctx => {
  const {projectId} = ctx.query
  return await ctx.reduxStore.dispatch(loadProjectAndModifications(projectId))
}

export default Modifications
