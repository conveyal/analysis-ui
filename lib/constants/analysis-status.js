//
export const LOADING_GRID = 'LOADING_GRID'
export const PERFORMING_ANALYSIS = 'PERFORMING_ANALYSIS'
export const COMPUTING_ISOCHRONE = 'COMPUTING_ISOCHRONE'
export const INITIALIZING_CLUSTER = 'INITIALIZING_CLUSTER'

/**
 * Higher priority statuses first.
 * When performing a comparison, we show the status that appears earlier in this list.
 */
export const STATUS_BY_PRIORITY = [
  INITIALIZING_CLUSTER, // if either is initializing we should show that as it can take forever
  LOADING_GRID,
  PERFORMING_ANALYSIS,
  COMPUTING_ISOCHRONE
]
