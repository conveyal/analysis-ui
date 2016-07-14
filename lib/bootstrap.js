import {loadAll} from './actions/project'
import {authIsRequired, bootstrap as bootstrapAuth0} from './auth0'

export default function bootstrap (store) {
  if (authIsRequired) {
    const loggedIn = bootstrapAuth0(store)
    if (!loggedIn) {
      return
    }
  }

  loadProjects(store)
}

function loadProjects (store) {
  const state = store.getState()
  const {project} = state
  const currentProjectId = project && project.currentProject && project.currentProjectId
  store.dispatch(loadAll({currentProjectId}))
}
