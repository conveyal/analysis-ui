/** Percentiles of travel time to request from the backend */
export const TRAVEL_TIME_PERCENTILES = [5, 25, 50, 75, 95]

// Bucket where R5 JARs are to be found
export const R5_BUCKET = 'https://r5-builds.s3.amazonaws.com'

// versions prior to 2.2.0 don't include the TravelTimeSurface API we use to draw isochrones
export const MINIMUM_R5_VERSION = 'v2.2.0'
