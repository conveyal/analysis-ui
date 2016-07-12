import shallowEqual from 'fbjs/lib/shallowEqual'

import {loadAllScenarios, loadScenario} from './actions'
import authenticatedFetch from './utils/authenticated-fetch'
import getFeedsRoutesAndStops from './actions/get-feeds-routes-and-stops'
import {bootstrap as bootstrapAuth0} from './auth0'

export default function bootstrap (store) {
  const state = store.getState()
  const loggedIn = bootstrapAuth0(store)

  if (loggedIn) {
    store.dispatch(loadAllScenarios())
    const {scenario} = state
    if (scenario && scenario.currentScenario) {
      store.dispatch(loadScenario(scenario.currentScenario.id))
    } else {
      store.dispatch(getFeedsRoutesAndStops({
        bundleId: null,
        forceCompleteUpdate: true,
        modifications: []
      }))
    }
  }

  // TODO: Split this up and move it into actions / reducers?
  store.subscribe(() => onStateChange(store.getState()))
}

function onStateChange ({
  scenario,
  user
}) {
  const {currentBundle, currentScenario} = scenario
  const scenarioIsLoaded = !!currentScenario
  const bundleIsLoaded = !!currentBundle
  const userIsLoggedIn = user && user.profile && user.idToken

  const newStoredState = {}
  const newScenarioState = {}
  if (userIsLoggedIn) newStoredState.user = user
  if (scenarioIsLoaded) {
    newScenarioState.bundleId = currentScenario.bundleId
    newScenarioState.id = currentScenario.id
    newScenarioState.name = currentScenario.name
    newScenarioState.variants = currentScenario.variants
    newStoredState.scenario = {
      currentScenario: {
        bundleId: currentScenario.bundleId,
        id: currentScenario.id,
        name: currentScenario.name
      }
    }
    if (bundleIsLoaded) {
      newStoredState.scenario.currentBundle = currentBundle
    }
    saveToServer(newScenarioState)
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

let scenarioState = null
function saveToServer (newState) {
  const scenarioStateHasChanged = !shallowEqual(newState, scenarioState)
  if (scenarioStateHasChanged) {
    window.requestAnimationFrame(function () {
      authenticatedFetch(`/api/scenario/${newState.id}`, {
        method: 'put',
        body: JSON.stringify(newState)
      })
      scenarioState = newState
    })
  }
}
