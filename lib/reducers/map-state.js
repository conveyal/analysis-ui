
export const reducers = {
  'add component to map' (state, action) {
    const components = new Set(state.components)
    components.add(action.payload)
    return {
      ...state,
      components: [...components]
    }
  },
  'remove component from map' (state, action) {
    const components = new Set(state.components)
    components.delete(action.payload)
    return {
      ...state,
      components: [...components]
    }
  },
  'delete modification' (state, action) {
    const modificationId = action.payload
    if (state.activeModification && state.activeModification.id === modificationId) {
      return {
        ...state,
        activeModification: null,
        activeTrips: []
      }
    } else {
      return state
    }
  },
  'log out' (state, action) {
    return { state: null }
  },
  'set map center' (state, action) {
    return {
      ...state,
      center: action.payload
    }
  },
  'set map state' (state, action) {
    return {
      ...state,
      ...action.payload
    }
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
}

export const initialState = {
  activeModification: null,
  activeTrips: [],
  center: {lat: 38.8886, lng: -77.0430},
  components: [],
  zoom: 12
}
