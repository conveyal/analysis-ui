import shallowEqual from 'fbjs/lib/shallowEqual'

import {loadAllProjects, loadProject} from './actions'
import authenticatedFetch from './utils/authenticated-fetch'
import getDataForModifications from './actions/get-data-for-modifications'
import {bootstrap as bootstrapAuth0} from './auth0'

export default function bootstrap (store) {
  const state = store.getState()
  const loggedIn = bootstrapAuth0(store)

  if (loggedIn) {
    store.dispatch(loadAllProjects())
    const {scenario} = state
    if (scenario && scenario.currentProject) {
      store.dispatch(loadProject(scenario.currentProject.id))
    } else {
      store.dispatch(getDataForModifications({ modifications: [], bundleId: null, forceCompleteUpdate: true }))
    }
  }

  // TODO: Split this up and move it into actions / reducers?
  store.subscribe(() => onStateChange(store.getState()))
}

function onStateChange ({
  scenario,
  user
}) {
  const {currentBundle, currentProject} = scenario
  const projectIsLoaded = !!currentProject
  const bundleIsLoaded = !!currentBundle
  const userIsLoggedIn = user && user.profile && user.idToken

  const newStoredState = {}
  const newProjectState = {}
  if (userIsLoggedIn) newStoredState.user = user
  if (projectIsLoaded) {
    newProjectState.bundleId = currentProject.bundleId
    newProjectState.id = currentProject.id
    newProjectState.name = currentProject.name
    newProjectState.variants = currentProject.variants
    newStoredState.scenario = {
      currentProject: {
        bundleId: currentProject.bundleId,
        id: currentProject.id,
        name: currentProject.name
      }
    }
    if (bundleIsLoaded) {
      newStoredState.scenario.currentBundle = currentBundle
    }
    saveToServer(newProjectState)
  }
  updateLocalStorage(newStoredState)
}

let serializedStoredState = null
function updateLocalStorage (newState) {
  const serializedNewStoredState = JSON.stringify(newState)
  const localStateHasChanged = serializedNewStoredState !== serializedStoredState
  if (localStateHasChanged) {
    // Save parts of the state to localStorage
    window.localStorage.setItem('state', serializedNewStoredState)
    serializedStoredState = serializedNewStoredState
  }
}

let projectState = null
function saveToServer (newState) {
  const projectStateHasChanged = !shallowEqual(newState, projectState)
  if (projectStateHasChanged) {
    window.requestAnimationFrame(function () {
      authenticatedFetch(`/api/scenario/${newState.id}`, {
        method: 'put',
        body: JSON.stringify(newState)
      })
      projectState = newState
    })
  }
}
