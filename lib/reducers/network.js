import {
  DECREMENT_FETCH,
  FETCH_ERROR,
  INCREMENT_FETCH
} from '@conveyal/woonerf/fetch'

export const reducers = {
  [DECREMENT_FETCH] (state, action) {
    return {
      ...state,
      outstandingRequests: state.outstandingRequests - 1
    }
  },
  [INCREMENT_FETCH] (state, action) {
    return {
      ...state,
      outstandingRequests: state.outstandingRequests + 1
    }
  },
  [FETCH_ERROR] (state, action) {
    return {
      ...state,
      error: {
        error: action.payload.statusText
      }
    }
  },
  'decrement outstanding requests' (state, action) {
    return {
      ...state,
      outstandingRequests: state.outstandingRequests - 1
    }
  },
  'increment outstanding requests' (state, action) {
    return {
      ...state,
      outstandingRequests: state.outstandingRequests + 1
    }
  },
  'lock ui with error' (state, action) {
    return {
      ...state,
      error: action.payload
    }
  }
}

export const initialState = {
  error: null,
  outstandingRequests: 0
}
