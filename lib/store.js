/** Manage the Redux store */

import { createStore } from 'redux'
import { SET_PROJECT, SET_GRAPH, REPLACE_MODIFICATION } from './action-types'
import projectStore from './project-store'

/** the main reducer */
function reduce (state = {}, action) {
  if (action.type === SET_PROJECT) {
    state = Object.assign({}, state, { projectId: action.projectId })
    // load modifications (sync because it's using localStorage for now)
    let project = projectStore.getProject(state.projectId)
    state.modifications = project.modifications
    state.graphId = project.graphId
  } else if (action.type === SET_GRAPH) {
    state = Object.assign({}, state, { graphId: action.graphId })
  } else if (action.type === REPLACE_MODIFICATION) {
    // clone modifications
    state = Object.assign({}, state, { modifications: new Map([...state.modifications]) })
    state.modifications.set(action.modification.id, action.modification)
  }

  return state
}

let store = createStore(reduce)

// debug: log state changes
store.subscribe(() => console.log(store.getState()))

export default store
