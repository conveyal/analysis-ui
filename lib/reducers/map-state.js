
export const reducers = {
  'add component to map' (state, action) {
    const components = new Set(state.components)
    components.add(action.payload)
    return {
      ...state,
      components: setToArray(components)
    }
  },
  'log out' (state, action) {
    return createInitialState()
  },
  'remove component from map' (state, action) {
    const components = new Set(state.components)
    components.delete(action.payload)
    return {
      ...state,
      components: setToArray(components)
    }
  },
  'set active trips' (state, action) {
    return {
      ...state,
      activeTrips: action.payload.slice()
    }
  },
  'set isochrone' (state, action) {
    return {
      ...state,
      isochrone: action.payload
    }
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
  }
}

function createInitialState () {
  return {
    activeTrips: [],
    center: {lat: 38.8886, lng: -77.0430},
    components: [],
    zoom: 12
  }
}

export const initialState = createInitialState()

const setToArray = (s) => {
  let arr = []
  s.forEach((e) => arr.push(e))
  return arr
}
