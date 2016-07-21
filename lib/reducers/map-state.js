
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
      return {}
    } else {
      return state
    }
  },
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
}

export const initialState = {
  activeModification: null,
  activeTrips: [],
  components: []
}
