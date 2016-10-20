
export const reducers = {
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
