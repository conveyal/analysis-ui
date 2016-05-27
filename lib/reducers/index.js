import {combineReducers} from 'redux'
import {handleActions} from 'redux-actions'
import {routerReducer as routing} from 'react-router-redux'

const mapState = handleActions({
  'log out' (state, action) {
    return { state: null }
  },
  'set map state' (state, action) {
    return action.payload || {}
  }
}, {})

const scenario = handleActions({
  'delete bundle' (state, action) {
    const bundleId = action.payload
    return Object.assign({}, state, {
      bundles: state.bundles.filter((b) => b.id !== bundleId)
    })
  },
  'log out' (state, action) {
    return {
      data: {
        feeds: {},
        bundles: []
      },
      id: null,
      projects: [],
      variants: []
    }
  },
  'set project' (state, action) {
    return Object.assign({}, state, action.payload)
  },
  'set bundle' (state, action) {
    return Object.assign({}, state, { bundleId: action.payload })
  },
  'update modification' (state, action) {
    const modification = action.payload
    // clone modifications
    state = Object.assign({}, state, { modifications: new Map([...state.modifications]) })
    state.modifications.set(modification.id, modification)
    return state
  },
  'delete modification' (state, action) {
    const modificationId = action.payload
    return Object.assign({}, state, { modifications: new Map([...state.modifications].filter(([id, k]) => id !== modificationId)) })
  },
  'load projects' (state, action) {
    return Object.assign({}, state, { projects: action.payload })
  },
  'update data' (state, action) {
    return Object.assign({}, state, { data: action.payload })
  },
  'update variants' (state, action) {
    return Object.assign({}, state, { variants: action.payload })
  }
}, {})

const network = handleActions({
  'increment outstanding requests' (state, action) {
    return Object.assign({}, state, { outstandingRequests: state.outstandingRequests + 1 })
  },
  'decrement outstanding requests' (state, action) {
    return Object.assign({}, state, { outstandingRequests: state.outstandingRequests - 1 })
  },
  'lock ui with error' (state, action) {
    return Object.assign({}, state, { error: action.payload })
  }
}, { outstandingRequests: 0 })

const user = handleActions({
  'log out' (state, action) {
    return {}
  },
  'set user' (state, action) {
    return Object.assign({}, state, action.payload)
  },
  'set id token' (state, action) {
    return Object.assign({}, state, { id_token: action.payload })
  }
}, {})

export default combineReducers({
  mapState,
  routing,
  network,
  scenario,
  user
})
