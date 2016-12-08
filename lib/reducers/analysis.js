
export const reducers = {
  'clear isochrone results' (state, action) {
    return {
      ...state,
      isochrone: null,
      isochroneLatLng: null
    }
  },
  'set isochrone cutoff' (state, action) {
    return {
      ...state,
      isochroneCutoff: action.payload
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
    const { isochrone, comparisonIsochrone, accessibility, comparisonAccessibility, indicator, grid, isochroneCutoff, spectrogramData, comparisonSpectrogramData } = action.payload
    return {
      ...state,
      isochrone,
      grid,
      accessibility,
      isochroneCutoff,
      spectrogramData,
      comparisonIsochrone,
      comparisonAccessibility,
      comparisonSpectrogramData,
      currentIndicator: indicator
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
  },
  'set active variant' (state, action) {
    return {
      ...state,
      activeVariant: action.payload
    }
  },
  'set doing comparison' (state, action) {
    return {
      ...state,
      comparisonInProgress: action.payload
    }
  },
  'set comparison scenario' (state, action) {
    const { id, bundleId, variantIndex } = action.payload
    return {
      ...state,
      comparisonScenarioId: id,
      comparisonBundleId: bundleId,
      comparisonVariant: variantIndex,
      comparisonModifications: null
    }
  },
  'set comparison modifications' (state, action) {
    // re-set all these to ensure the ID and the modifications cannot get out of sync
    const { id, bundleId, variantIndex, modifications } = action.payload
    return {
      ...state,
      comparisonScenarioId: id,
      comparisonBundleId: bundleId,
      comparisonVariant: variantIndex,
      comparisonModifications: modifications
    }
  },
  'set active regional analyses' (state, action) {
    return {
      ...state,
      regional: {
        // clear data
        id: null,
        comparisonId: null,
        ...action.payload,
        grid: null,
        comparisonGrid: null,
        probabilityGrid: null,
        minimumImprovementProbability: state.regional.minimumImprovementProbability
      }
    }
  },
  'set regional analysis grids' (state, action) {
    const { grid, comparisonGrid, probabilityGrid } = action.payload
    return {
      ...state,
      regional: {
        ...state.regional,
        grid,
        comparisonGrid,
        probabilityGrid
      }
    }
  },
  'set minimum improvement probability' (state, action) {
    return {
      ...state,
      regional: {
        ...state.regional,
        minimumImprovementProbability: action.payload
      }
    }
  }
}

export const initialState = {
  isochroneCutoff: 60,
  isFetchingIsochrone: false,
  active: false,
  comparisonInProgress: false,
  regional: {
    id: null,
    comparisonId: null,
    percentile: 50,
    grid: null,
    comparisonGrid: null,
    probabilityGrid: null,
    minimumImprovementProbability: 0.95
  }
}
