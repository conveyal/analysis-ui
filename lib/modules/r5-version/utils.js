//
import {VERSION_PARSE_REGEX} from './constants'

/**
 * Convert an r5 version to a number for comparing
 */
export function versionToNumber(version) {
  const versionMatch = (version || '').match(VERSION_PARSE_REGEX)
  if (versionMatch) {
    const [, major, minor, patch, commit] = versionMatch

    // NB Assumes no major, minor, patch, or commit version exceeds 100
    return (
      parseInt(major) * 10000 +
      parseInt(minor) * 100 +
      parseInt(patch) +
      parseInt(commit || 0) / 100
    )
  }

  return 0
}
