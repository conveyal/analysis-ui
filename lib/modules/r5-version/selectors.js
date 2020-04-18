import flow from 'lodash/flow'

import {initialState} from './reducer'

/**
 * Use this to set the state key
 */
const localState = (state) => state.r5Version || initialState()

export const currentVersion = flow(localState, (state) => state.currentVersion)
export const usedVersions = flow(localState, (state) => state.usedVersions)
