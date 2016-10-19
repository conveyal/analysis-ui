
export const reducers = {
  'clear isochrone results' (state, action) {
    return {
      ...state,
      isochrone: null,
      isochroneLatLng: null
    }
  },
  'set isochrone fetch status' (state, action) {
    return {
      ...state,
      isFetchingIsochrone: action.payload
    }
  },
  'set isochrone latlng' (state, action) {
    return {
      ...state,
      isochroneLatLng: action.payload
    }
  },
  'set isochrone results' (state, action) {
    const { isochrone, accessibility, indicator, isochroneCutoff, spectrogramData } = action.payload
    return {
      ...state,
      isochrone,
      accessibility,
      isochroneCutoff,
      spectrogramData,
      currentIndicator: indicator
    }
  },
  'set isochrone cutoff' (state, action) {
    return {
      ...state,
      isochroneCutoff: action.payload
    }
  },
  'enter analysis mode' (state, action) {
    return {
      ...state,
      active: true
    }
  },
  'exit analysis mode' (state, action) {
    return {
      ...state,
      active: false
    }
  }
}

export const initialState = {
  isochroneCutoff: 60,
  isFetchingIsochrone: false,
  active: false
}
