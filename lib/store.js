/** Manage the Redux store */

import { createStore } from 'redux'
import { SET_PROJECT, SET_GRAPH, REPLACE_MODIFICATION, UPDATE_DATA, DELETE_MODIFICATION, ADD_LAYER, REMOVE_LAYER, ADD_CONTROL, REMOVE_CONTROL, LOAD_PROJECTS, SET_MAP_STATE } from './action-types'
import ProjectStore from './project-store'

// set up the basemap
let initialState = {
  data: {
    feeds: new Map(),
    bundles: []
  },
  mapState: {
    state: null // no special state
  }
}

/** the main reducer */
function reduce (state = initialState, action) {
  if (action.type === SET_PROJECT) {
    state = Object.assign({}, state, action.project)
  } else if (action.type === SET_GRAPH) {
    state = Object.assign({}, state, { bundleId: action.bundleId })
  } else if (action.type === REPLACE_MODIFICATION) {
    // clone modifications
    state = Object.assign({}, state, { modifications: new Map([...state.modifications]) })
    state.modifications.set(action.modification.id, action.modification)
  } else if (action.type === DELETE_MODIFICATION) {
    state = Object.assign({}, state, { modifications: new Map([...state.modifications].filter(([id, k]) => id !== action.id)) })
  } else if (action.type === ADD_LAYER) {
    state = Object.assign({}, state, { layers: new Map([...state.layers]) })
    state.layers.set(action.layerId, action.layer)
  } else if (action.type === REMOVE_LAYER) {
    state = Object.assign({}, state, { layers: new Map([...state.layers]) })
    state.layers.delete(action.layerId)
  } else if (action.type === ADD_CONTROL) {
    state = Object.assign({}, state, { controls: new Map([...state.controls]) })
    state.controls.set(action.controlId, action.control)
  } else if (action.type === REMOVE_CONTROL) {
    state = Object.assign({}, state, { controls: new Map([...state.controls]) })
    state.controls.delete(action.controlId)
  } else if (action.type === LOAD_PROJECTS) {
    state = Object.assign({}, state, { projects: action.projects })
  } else if (action.type === UPDATE_DATA) {
    state = Object.assign({}, state, { data: action.payload })
  } else if (action.type === SET_MAP_STATE) {
    state = Object.assign({}, state, { mapState: action.payload })
  }

  return state
}

let store = createStore(reduce)
store.projectStore = new ProjectStore(store)

store.projectStore.getProjects().then(projects => store.dispatch({
  type: LOAD_PROJECTS,
  projects
}))

// debug: log state changes
store.subscribe(() => console.log(store.getState()))

export default store
