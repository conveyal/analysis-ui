/** Manage the Redux store */

import { createStore } from 'redux'
import {handleActions} from 'redux-actions'

const storedState = JSON.parse(window.localStorage.getItem('state')) || {}

// set up the basemap
const initialState = {
  data: {
    feeds: {},
    bundles: [] // not loaded
  },
  id: storedState.id,
  mapState: {
    state: null // no special state
  },
  projects: [], // not loaded
  user: storedState.user,
  variants: []
}

/** the main reducer */
const reducer = handleActions({
  'delete bundle' (state, action) {
    const bundleId = action.payload
    return Object.assign({}, state, {
      bundles: state.bundles.filter((b) => b.id !== bundleId)
    })
  },
  'set project' (state, action) {
    return Object.assign({}, state, action.payload)
  },
  'set bundle' (state, action) {
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
  'set map state' (state, action) {
    return Object.assign({}, state, { mapState: action.payload })
  },
  'set user' (state, action) {
    return Object.assign({}, state, { user: action.payload })
  },
  'update data' (state, action) {
    return Object.assign({}, state, { data: action.payload })
  },
  'update variants' (state, action) {
    return Object.assign({}, state, { variants: action.payload })
  }
}, initialState)

const store = createStore(reducer)

export default store
