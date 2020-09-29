import {MINIMUM_R5_VERSION, VERSION_PARSE_REGEX} from './constants'

/**
 * Convert an r5 version to a number for comparing
 */
export function versionToNumber(version: string): number {
  const versionMatch = (version || '').match(VERSION_PARSE_REGEX)
  if (versionMatch) {
    const [, major, minor, patch, commit] = versionMatch

    // NB Assumes no major, minor, patch, or commit version exceeds 100
    return (
      parseInt(major) * 10000 +
      parseInt(minor) * 100 +
      parseInt(patch) +
      parseInt(commit || '0') / 100
    )
  }

  return 0
}

/**
 * Check if the r5 version is older than a given minimum.
 */
export function workerVersionInRange(
  version: string,
  min: string = MINIMUM_R5_VERSION,
  max = 'v100'
): boolean {
  const versionNumber = versionToNumber(version)
  return (
    versionNumber >= versionToNumber(min) &&
    versionNumber <= versionToNumber(max)
  )
}
