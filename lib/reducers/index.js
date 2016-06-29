import {combineReducers} from 'redux'
import {handleActions} from 'redux-actions'
import {routerReducer as routing} from 'react-router-redux'

import dbg from 'debug'

const debug = dbg('scenario-editor:reducers')

const mapState = handleActions({
  'log out' (state, action) {
    return { state: null }
  },
  'set map state' (state, action) {
    return action.payload || {}
  },
  'set active trips' (state, action) {
    return {
      ...state,
      activeTrips: action.payload.slice()
    }
  },
  'set active modification' (state, {payload}) {
    const activeModification = payload
    if (!state.activeModification || state.activeModification.id !== activeModification.id) {
      return {
        ...state,
        activeModification: {...activeModification},
        activeTrips: []
      }
    } else {
      return state
    }
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
  'set active modification' (state, action) {
    if (!state.activeModification || state.activeModification.id !== action.payload.id) {
      return {
        ...state,
        activeModification: {...action.payload}
      }
    } else {
      return state
    }
  },
  'update modification' (state, action) {
    const modification = action.payload
    // clone modifications
    state = Object.assign({}, state, {
      modifications: new Map([...state.modifications])
    })
    state.modifications.set(modification.id, modification)
    return state
  },
  'delete modification' (state, action) {
    const modificationId = action.payload
    return Object.assign({}, state, { modifications: new Map([...state.modifications].filter(([id, k]) => id !== modificationId)) })
  },
  'set projects' (state, action) {
    return Object.assign({}, state, { projects: action.payload })
  },
  'update data' (state, action) {
    return Object.assign({}, state, { data: action.payload })
  },
  'create variant' (state, action) {
    return Object.assign({}, state, {
      variants: [
        ...state.variants,
        action.payload
      ]
    })
  },
  'expand variant' (state, action) {
    const index = action.payload
    return {
      ...state,
      modifications: new Map([...state.modifications].map(([id, modification]) => {
        return [id, {
          ...modification,
          expanded: modification.variants[index]
        }]
      }))
    }
  },
  'show variant' (state, action) {
    const index = action.payload
    return {
      ...state,
      modifications: new Map([...state.modifications].map(([id, modification]) => {
        return [id, {
          ...modification,
          showOnMap: modification.variants[index]
        }]
      }))
    }
  },
  'update variant' (state, action) {
    const variants = [...state.variants]
    variants[action.payload.index] = action.payload.value
    return Object.assign({}, state, { variants })
  },
  'update variants' (state, action) {
    if (action.payload == null || action.payload.length === 0) {
      debug('Attempt to set null variants, ignoring') // TODO: seems like this shouldn't ever occur?
      return state
    }
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
    return Object.assign({}, state, { idToken: action.payload })
  }
}, {})

export default combineReducers({
  mapState,
  routing,
  network,
  scenario,
  user
})
