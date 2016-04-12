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

  if (state.scenario && state.scenario.id) {
    getProject(state.scenario.id)
      .then((project) => {
        transitDataSource.getDataForModifications({ modifications: [...project.modifications.values()], bundleId: project.bundleId })
        store.dispatch(setProject(project))
      })
  } else {
    transitDataSource.getDataForModifications({ modifications: [], bundleId: null })
  }

  // TODO: Split this up and move it
  store.subscribe(() => onStateChange(store.getState()))
}

function onStateChange (newState) {
  window.requestAnimationFrame(function () {
    // NB this won't overwrite the project when it is being loaded as the reducer for switching projects loads the modifications
    const {bundleId, name, modifications, id, variants} = newState.scenario
    if (id && name) {
      saveProject({
        bundleId,
        id,
        name,
        variants
      }, modifications)
    }

    window.localStorage.setItem('state', JSON.stringify({
      scenario: {
        id
      },
      user: newState.user
    }))
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
