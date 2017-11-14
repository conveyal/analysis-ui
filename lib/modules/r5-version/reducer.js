// @flow
import type {Action, State} from './types'

import {RECOMMENDED_R5_VERSION} from './constants'

export function initialState (): State {
  return {
    analysisVersions: [],
    currentVersion: RECOMMENDED_R5_VERSION,
    versions: []
  }
}

export default function reducer (state: State = initialState(), action: Action): State {
  switch (action.type) {
    case 'r5Version/SET_ALL':
      return {
        ...state,
        versions: action.payload
      }
    case 'r5Version/SET_ANALYSIS_VERSIONS':
      return {
        ...state,
        analysisVersions: action.payload
      }
    case 'r5Version/SET_CURRENT':
      return {
        ...state,
        currentVersion: action.payload
      }
  }

  return state
}
