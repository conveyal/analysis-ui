import {RECOMMENDED_R5_VERSION} from './constants'

export function initialState() {
  return {
    currentVersion: RECOMMENDED_R5_VERSION,
    usedVersions: []
  }
}

export default function reducer(state = initialState(), action) {
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
