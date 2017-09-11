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
  [FETCH_ERROR] (state, {payload}) {
    if (
      payload.url &&
      payload.url.endsWith('/api/analysis/enqueue/single') &&
      payload.status === 400
    ) {
      // analysis error due to malformed scenario, handled specifically in
      // actions/analysis, don't lock ui
      return state
    } else if (payload.value && Array.isArray(payload.value)) {
      const value = payload.value[0]
      if (value.message) {
        return {
          ...state,
          error: {
            error: value.message || 'Server Error',
            detailMessage: value.exception
              ? exceptionToString(value.exception)
              : ''
          }
        }
      } else {
        return {
          ...state,
          error: {
            error: value.title,
            detailMessage: value.messages[0].replace(/\\n/g, '<br />')
          }
        }
      }
    } else {
      return {
        ...state,
        error: {
          error: 'Fetch Error',
          detailMessage: payload.value ? payload.value.message : payload.message
        }
      }
    }
  },
  'lock ui with error' (state, action) {
    return {
      ...state,
      error: action.payload
    }
  },
  'clear error' (state, action) {
    return {
      ...state,
      error: null
    }
  }
}

export const initialState = {
  error: null,
  outstandingRequests: []
}

function exceptionToString (exception) {
  return `Caused by: ${exception.message ||
    ''}<br />&nbsp;&nbsp;&nbsp;${exception.stackTrace
    .map(traceToLine)
    .join('<br />&nbsp;&nbsp;&nbsp;')}`
}

const traceToLine = trace =>
  `${trace.className}.${trace.methodName}(${trace.fileName}:${trace.lineNumber})`
