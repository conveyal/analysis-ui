import {loadProjects, setUser, updateData} from './actions'
import {lock} from './auth0'
import {getProjects, saveProject} from './project-store'
import transitDataSource from './transit-data-source'

export default function bootstrap (store) {
  refreshToken(store, lock.getClient())

  // only need to do this once in the app, so we do it here
  transitDataSource.subscribe((data) => store.dispatch(updateData(data)))

  getProjects()
    .then((projects) => store.dispatch(loadProjects(projects)))

  transitDataSource.getDataForModifications({ modifications: [], bundleId: null })

  // TODO: Split this up and move it
  // debug: log state changes
  store.subscribe(() => {
    const state = store.getState()
    console.log(store.getState())

    // NB this won't overwrite the project when it is being loaded as the reducer for switching projects loads the modifications
    const {bundle, modifications, project, variants} = state
    if (project && project.id) {
      saveProject({
        bundleId: bundle.id,
        id: project.id,
        name: project.name,
        variants
      }, modifications)
    }

    window.requestAnimationFrame(function () {
      window.localStorage.setItem('state', JSON.stringify({ user: state.user }))
    })
  })
}

function refreshToken (store, auth0) {
  const {user} = store.getState()
  if (user && user.refresh_token) {
    auth0.refreshToken(user.refresh_token, function (err, delegationResult) {
      if (err) {
        store.dispatch(setUser(null))
      } else {
        user.id_token = delegationResult.id_token
        store.dispatch(setUser(user))
      }
    })
  }
}
