import {loadProjects, setProject, setUser, updateData} from './actions'
import {lock} from './auth0'
import {getProject, getProjects, saveProject} from './project-store'
import transitDataSource from './transit-data-source'

export default function bootstrap (store) {
  const state = store.getState()

  refreshToken(store, lock.getClient())

  // TODO: Examine this pattern. TransitDataSource should probably be dispatching events.
  // only need to do this once in the app, so we do it here
  transitDataSource.subscribe((data) => store.dispatch(updateData(data)))

  getProjects()
    .then((projects) => store.dispatch(loadProjects(projects)))

  transitDataSource.getDataForModifications({ modifications: [], bundleId: null })

  if (state.id) {
    getProject(state.id)
      .then((project) => store.dispatch(setProject(project)))
  }

  // TODO: Split this up and move it
  // debug: log state changes
  store.subscribe(onStateChange(store))
}

function onStateChange (store) {
  return function () {
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
      window.localStorage.setItem('state', JSON.stringify({
        id: state.id,
        user: state.user
      }))
    })
  }
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
