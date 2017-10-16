/** Percentiles of travel time to request from the backend */
export const TRAVEL_TIME_PERCENTILES = [5, 25, 50, 75, 95]

// Bucket where R5 JARs are to be found
export const R5_BUCKET = 'https://r5-builds.s3.amazonaws.com'

// versions prior to 3.1.0 have supergrid/subgrid problems
export const MINIMUM_R5_VERSION = 'v3.1.0'
