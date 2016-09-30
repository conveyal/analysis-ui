
export const reducers = {
  'clear isochrone results' (state, action) {
    return {
      ...state,
      isochronesByCutoff: null,
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
      isochroneLatLng: null
    }
  },
  'set isochrone results' (state, action) {
    const isochrones = action.payload.avgCase.isochrones
    return {
      ...state,
      isochronesByCutoff: isochrones.reduce((isochronesByCutoff, entry) => {
        isochronesByCutoff[entry.cutoffSec] = entry.geometry
        return isochronesByCutoff
      }, {})
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
  isochroneCutoff: 3600,
  isFetchingIsochrone: false
}
