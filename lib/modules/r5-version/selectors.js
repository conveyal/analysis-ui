// @flow
import flow from 'lodash/flow'

import {initialState} from './reducer'
import type {State} from './types'

type FullState = {
  r5Version: State
}

/**
 * Use this to set the state key
 */
const localState = (state: FullState) => state.r5Version || initialState()

export const currentVersion =
  flow(localState, (state: State) => state.currentVersion)
export const usedVersions =
  flow(localState, (state: State) => state.usedVersions)
