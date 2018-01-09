// @flow

// Bucket where R5 JARs are to be found
export const R5_BUCKET = 'https://r5-builds.s3.amazonaws.com'

// Recommended r5 version
export const RECOMMENDED_R5_VERSION = 'v3.4.1'

// versions prior to 3.1.0 have supergrid/subgrid problems
export const MINIMUM_R5_VERSION = 'v3.1.0'

// Determine if a particular version is a release version
export const RELEASE_VERSION_REGEX = /^v[0-9]+\.[0-9]+\.[0-9]+$/

// Parse a version into its constituent pieces (major, minor, patch, distance from last release, commit)
export const VERSION_PARSE_REGEX = /^v([0-9]+).([0-9]+).([0-9]+)-?([0-9]+)?-?(.*)?$/
