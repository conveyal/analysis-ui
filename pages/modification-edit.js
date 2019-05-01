import {load} from '../lib/actions/project'
import ModificationEditor from '../lib/containers/modification-editor'
import projectIsLoaded from '../lib/selectors/project-is-loaded'
import modificationFeedIsLoaded from '../lib/selectors/modification-feed-is-loaded'

ModificationEditor.getInitialProps = async ctx => {
  const store = ctx.reduxStore
  const state = store.getState()

  if (!projectIsLoaded(state, {query: ctx.query})) {
    await ctx.reduxStore.dispatch(load(ctx.query.projectId))
  }
}

export default ModificationEditor
