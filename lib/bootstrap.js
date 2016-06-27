import shallowEqual from 'fbjs/lib/shallowEqual'

import {loadAllProjects, setProject} from './actions'
import getDataForModifications from './actions/get-data-for-modifications'
import {bootstrap as bootstrapAuth0} from './auth0'
import * as projectStore from './project-store'

export default function bootstrap (store) {
  const state = store.getState()
  const loggedIn = bootstrapAuth0(store)

  if (loggedIn) {
    store.dispatch(loadAllProjects())

    if (state.scenario && state.scenario.id) {
      projectStore.get(state.scenario.id)
        .then((project) => {
          store.dispatch([
            setProject(project),
            getDataForModifications({ modifications: [...project.modifications.values()], bundleId: project.bundleId, forceCompleteUpdate: true })
          ])
        })
        .catch((e) => {
          console.error('Project not found on bootstrap.')
        })
    } else {
      store.dispatch(getDataForModifications({ modifications: [], bundleId: null, forceCompleteUpdate: true }))
    }
  }

  // TODO: Split this up and move it
  store.subscribe(() => onStateChange(store))
}

let projectState = null
let storedState = null
function onStateChange (store) {
  const {scenario, user} = store.getState()
  const {bundleId, name, id, variants} = scenario

  const newStoredState = JSON.stringify({
    scenario: {
      id
    },
    user
  })
  if (newStoredState !== storedState) {
    // Save parts of the state to localStorage
    window.localStorage.setItem('state', JSON.stringify({
      scenario: {
        id
      },
      user
    }))
    storedState = newStoredState
  }

  const newProjectState = {
    bundleId,
    id,
    name,
    variants
  }
  if (!shallowEqual(newProjectState, projectState)) {
    window.requestAnimationFrame(function () {
      // NB this won't overwrite the project when it is being loaded as the reducer for switching projects loads the modifications
      if (id && name) {
        projectStore.save({
          bundleId,
          id,
          name,
          variants
        })
      }
      projectState = newProjectState
    })
  }
}
