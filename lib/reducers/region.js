export const reducers = {
  'delete region' (state, action) {
    return {
      ...state,
      currentRegionId: undefined,
      regions: state.regions.filter(p => p._id !== action.payload)
    }
  },
  'set all regions' (state, action) {
    return {
      ...state,
      regions: [...action.payload]
    }
  },
  'clear current region' (state, action) {
    return {
      ...state,
      currentRegionId: undefined
    }
  },
  'set region' (state, action) {
    const region = action.payload
    const _id = region._id
    const regions = state.regions
    return {
      ...state,
      currentRegionId: _id,
      regions: [...regions.filter(p => p._id !== _id), region] // filter it out and then add it
    }
  },
  'set regional analyses' (state, action) {
    const regionalAnalyses = action.payload
    return {
      ...state,
      regionalAnalyses
    }
  },
  /**
   * mark a regional analysis as deleted locally so that it disappears immediately. It will be
   * marked as deleted on the server soon.
   */
  'delete regional analysis' (state, action) {
    const id = action.payload
    return {
      ...state,
      regionalAnalyses: state.regionalAnalyses.filter(r => r._id !== id)
    }
  },
  /** Add a bookmark to the region locally */
  'create bookmark' (state, action) {
    const region = {...state.regions.find(p => p._id === state.currentRegionId)}
    region.bookmarks = [...region.bookmarks, action.payload]
    return {
      ...state,
      regions: state.regions
        .map(p => p._id === region._id ? region : p)
    }
  },
  /** Add a newly uploaded aggregation area to the current region */
  'add aggregation area locally' (state, action) {
    const region = {...state.regions.find(p => p._id === state.currentRegionId)}
    region.aggregationAreas = [...region.aggregationAreas, action.payload]
    return {
      ...state,
      regions: state.regions
        .map(p => p._id === region._id ? region : p)
    }
  }
}

export const initialState = {
  currentRegionId: undefined,
  regions: []
}
