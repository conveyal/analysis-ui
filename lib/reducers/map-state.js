
export const reducers = {
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
  activeTrips: []
}
