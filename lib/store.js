/** Manage the Redux store */

import { createStore } from 'redux'
import {handleActions} from 'redux-actions'

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
const reducer = handleActions({
  'set user' (state, action) {
    return Object.assign({}, state, { user: action.payload })
  },
  SET_PROJECT (state, action) {
    return Object.assign({}, state, action.project)
  },
  SET_BUNDLE (state, action) {
    return Object.assign({}, state, { bundleId: action.payload })
  },
  REPLACE_MODIFICATION (state, action) {
    // clone modifications
    state = Object.assign({}, state, { modifications: new Map([...state.modifications]) })
    state.modifications.set(action.modification.id, action.modification)
    return state
  },
  DELETE_MODIFICATION (state, action) {
    return Object.assign({}, state, { modifications: new Map([...state.modifications].filter(([id, k]) => id !== action.id)) })
  },
  'load projects' (state, action) {
    return Object.assign({}, state, { projects: action.payload })
  },
  'update data' (state, action) {
    return Object.assign({}, state, { data: action.payload })
  },
  SET_MAP_STATE (state, action) {
    return Object.assign({}, state, { mapState: action.payload })
  },
  UPDATE_VARIANTS (state, action) {
    return Object.assign({}, state, { variants: action.payload })
  }
}, initialState)

const store = createStore(reducer)

export default store
