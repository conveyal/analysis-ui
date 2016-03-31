/** Manage the Redux store */

import { createStore } from 'redux'
import { SET_PROJECT, SET_BUNDLE, SET_USER, REPLACE_MODIFICATION, UPDATE_DATA, DELETE_MODIFICATION, LOAD_PROJECTS, SET_MAP_STATE, UPDATE_VARIANTS } from './action-types'

const storedState = JSON.parse(window.localStorage.getItem('state')) || {}

// set up the basemap
const initialState = {
  data: {
    feeds: new Map(),
    bundles: [] // not loaded
  },
  mapState: {
    state: null // no special state
  },
  projects: [], // not loaded
  user: storedState.user,
  variants: []
}

/** the main reducer */
function reduce (state = initialState, action) {
  if (action.type === SET_USER) {
    state = Object.assign({}, state, { user: action.payload })
  } else if (action.type === SET_PROJECT) {
    state = Object.assign({}, state, action.project)
  } else if (action.type === SET_BUNDLE) {
    state = Object.assign({}, state, { bundleId: action.payload })
  } else if (action.type === REPLACE_MODIFICATION) {
    // clone modifications
    state = Object.assign({}, state, { modifications: new Map([...state.modifications]) })
    state.modifications.set(action.modification.id, action.modification)
  } else if (action.type === DELETE_MODIFICATION) {
    state = Object.assign({}, state, { modifications: new Map([...state.modifications].filter(([id, k]) => id !== action.id)) })
  } else if (action.type === LOAD_PROJECTS) {
    state = Object.assign({}, state, { projects: action.projects })
  } else if (action.type === UPDATE_DATA) {
    state = Object.assign({}, state, { data: action.payload })
  } else if (action.type === SET_MAP_STATE) {
    state = Object.assign({}, state, { mapState: action.payload })
  } else if (action.type === UPDATE_VARIANTS) {
    state = Object.assign({}, state, { variants: action.payload })
  }

  return state
}

let store = createStore(reduce)

export default store
