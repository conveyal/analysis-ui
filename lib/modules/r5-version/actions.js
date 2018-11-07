// @flow
import type {UsedVersion, Action} from './types'

export const setCurrentR5Version =
  (version: string): Action => ({
    type: 'r5Version/SET_CURRENT',
    payload: version
  })

export const setUsedVersions =
  (versions: UsedVersion[]) => ({
    type: 'r5Version/SET_USED_VERSIONS',
    payload: versions
  })