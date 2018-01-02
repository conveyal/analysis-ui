// @flow
import filter from 'lodash/filter'
import flow from 'lodash/flow'
import sortBy from 'lodash/sortBy'
import {createSelector} from 'reselect'

import {
  MINIMUM_R5_VERSION,
  RELEASE_VERSION_REGEX,
  VERSION_PARSE_REGEX
} from './constants'
import {initialState} from './reducer'

import type {State} from './types'

type FullState = {
  r5Version: State
}

const MIN_VERSION_NUM = versionToNumber(MINIMUM_R5_VERSION)

/**
 * Convert an r5 version to a number for comparing
 */
export function versionToNumber (version: string): number {
  const versionMatch = version.match(VERSION_PARSE_REGEX)
  if (versionMatch) {
    const [, major, minor, patch, commit] = versionMatch

    // NB Assumes no major, minor, patch, or commit version exceeds 100
    return parseInt(major) * 10000 +
      parseInt(minor) * 100 +
      parseInt(patch) +
      parseInt(commit || 0) / 100
  }

  return -1
}

/**
 * Use this to set the state key
 */
export const localState = (state: FullState) => state.r5Version || initialState()

export const analysisVersion =
  flow(localState, (state: State) => state.analysisVersion)
export const versions =
  flow(localState, (state: State) => state.versions)
export const currentR5Version =
  flow(localState, (state: State) => state.currentVersion)

/**
 * Get a sorted list of all the valid r5 versions
 */
export const allValidVersions = createSelector(
  versions,
  (versions) => sortBy(
    filter(versions, (version) => versionToNumber(version) >= MIN_VERSION_NUM),
    v => -versionToNumber(v) // sort descending
  )
)

/**
 * Filter out all non-release versions
 */
export const releaseVersions = createSelector(
  allValidVersions,
  (versions) => filter(versions, v => RELEASE_VERSION_REGEX.test(v))
)

/**
 * Is the current version out of date?
 */
export const newerVersionIsAvailable = createSelector(
  currentR5Version,
  releaseVersions,
  (current, releases) => releases.length > 0
    ? versionToNumber(current) < versionToNumber(releases[0])
    : false
)
