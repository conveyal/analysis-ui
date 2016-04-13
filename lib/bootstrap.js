import {loadProjects, setProject, updateData} from './actions'
import {bootstrap as bootstrapAuth0, authIsRequired} from './auth0'
import {getProject, getProjects, saveProject} from './project-store'
import transitDataSource from './transit-data-source'

export default function bootstrap (store) {
  const state = store.getState()

  if (authIsRequired) {
    bootstrapAuth0(store)
  }

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
  store.subscribe(() => onStateChange(store))
}

function onStateChange (store) {
  const {scenario, user} = store.getState()
  const {bundleId, name, modifications, id, variants} = scenario

  // Save parts of the state to localStorage
  window.localStorage.setItem('state', JSON.stringify({
    scenario: {
      id
    },
    user
  }))

  window.requestAnimationFrame(function () {
    // NB this won't overwrite the project when it is being loaded as the reducer for switching projects loads the modifications
    if (id && name) {
      saveProject({
        bundleId,
        id,
        name,
        variants
      }, modifications)
    }
  })
}
