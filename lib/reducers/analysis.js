
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
    const { isochrone, accessibility } = action.payload
    return {
      ...state,
      isochrone,
      accessibility
    }
  },
  'set isochrone cutoff' (state, action) {
    return {
      ...state,
      isochroneCutoff: action.payload
    }
  }
}

export const initialState = {
  isochroneCutoff: 60,
  isFetchingIsochrone: false
}
