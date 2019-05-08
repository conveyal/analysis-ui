import isFunction from 'lodash/isFunction'
import sortBy from 'lodash/sortBy'

const sortByCreatedAt = a => sortBy(a, i => -i.createdAt)

const replaceItem = (a, match, replaceWith) =>
  a.map(i =>
    match(i) ? (isFunction(replaceWith) ? replaceWith(i) : replaceWith) : i
  )

const replaceCurrentRegionInState = (state, replaceWith) => ({
  ...state,
  regions: sortByCreatedAt(
    replaceItem(
      state.regions,
      r => r._id === state.currentRegionId,
      replaceWith
    )
  )
})

export const reducers = {
  'delete region'(state, action) {
    return {
      ...state,
      bundles: [],
      currentRegionId: undefined,
      regions: state.regions.filter(p => p._id !== action.payload)
    }
  },
  'set all regions'(state, action) {
    return {
      ...state,
      regions: sortByCreatedAt(action.payload)
    }
  },
  'clear current region'(state) {
    return {
      ...state,
      bundles: [],
      currentRegionId: undefined
    }
  },
  'set region'(state, action) {
    const region = action.payload
    return {
      ...state,
      currentRegionId: region._id,
      regions: sortByCreatedAt([
        ...state.regions.filter(r => r._id !== region._id),
        region
      ])
    }
  },
  'set regional analysis'(state, action) {
    return {
      ...state,
      regionalAnalyses: sortByCreatedAt([
        ...state.regionalAnalyses.filter(r => r._id !== action.payload._id),
        action.payload
      ])
    }
  },
  'set regional analyses'(state, action) {
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
  'delete regional analysis'(state, action) {
    const id = action.payload
    return {
      ...state,
      regionalAnalyses: state.regionalAnalyses.filter(r => r._id !== id)
    }
  },
  /** Add a bookmark to the region locally */
  'create bookmark'(state, action) {
    return replaceCurrentRegionInState(state, r => ({
      ...r,
      bookmarks: [action.payload, ...r.bookmarks]
    }))
  },
  /** Add a newly uploaded aggregation area to the current region */
  'add aggregation area locally'(state, action) {
    return replaceCurrentRegionInState(state, r => ({
      ...r,
      aggregationAreas: [action.payload, ...r.aggregationAreas]
    }))
  },

  // Bundles
  'add bundle'(state, action) {
    return {
      ...state,
      bundles: [action.payload, ...state.bundles]
    }
  },
  'delete bundle'(state, action) {
    return {
      ...state,
      bundles: state.bundles.filter(b => b._id !== action.payload)
    }
  },
  'set bundle'(state, action) {
    const bundle = action.payload
    return {
      ...state,
      bundles: replaceItem(state.bundles, b => b._id === bundle._id, bundle)
    }
  },
  'set bundles'(state, action) {
    return {
      ...state,
      bundles: action.payload
    }
  }
}

export const initialState = {
  bundles: [],
  currentRegionId: undefined,
  regions: []
}
