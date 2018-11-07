// @flow
import type {Action, State} from './types'
import {RECOMMENDED_R5_VERSION} from './constants'

export function initialState (): State {
  return {
    currentVersion: RECOMMENDED_R5_VERSION,
    usedVersions: []
  }
}

export default function reducer (state: State = initialState(), action: Action): State {
  switch (action.type) {
    case 'r5Version/SET_CURRENT':
      return {
        ...state,
        currentVersion: action.payload || RECOMMENDED_R5_VERSION
      }
    case 'r5Version/SET_USED_VERSIONS':
      return {
        ...state,
        usedVersions: action.payload
      }
  }

  return state
}
