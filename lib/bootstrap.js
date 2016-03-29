import {createAction} from 'redux-actions'

import {LOAD_PROJECTS, UPDATE_DATA} from './action-types'
import ProjectStore from './project-store'
import getDataForModifications from './get-data-for-modifications'

export default function bootstrap (store) {
  const updateData = createAction(UPDATE_DATA)

  store.projectStore = new ProjectStore(store)

  store.projectStore.getProjects().then(projects => store.dispatch({
    type: LOAD_PROJECTS,
    projects
  }))

  getDataForModifications({ modifications: [], bundleId: null })
    .then((data) => store.dispatch(updateData(data)))

  // TODO: Split this up and move it
  // debug: log state changes
  store.subscribe(() => {
    const state = store.getState()
    console.log(store.getState())
    window.requestAnimationFrame(function () {
      window.localStorage.setItem('state', JSON.stringify({
        user: state.user,
        sessionToken: state.sessionToken
      }))
    })
  })
}
