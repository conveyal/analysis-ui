// @flow
import {DECREMENT_FETCH, FETCH_ERROR, INCREMENT_FETCH} from 'lib/fetch-action'

type NetworkError = {
  detailMessage: string,
  error: string,
  stack: string,
  url: string
}

type Action =
  | {payload: any, type: 'lock ui with error'}
  | {payload: void, type: 'clear error'}

type FetchPayload = {
  id: number,
  options: any,
  type: string,
  url: string
}

type NetworkState = {
  error?: NetworkError,
  erroredFetches: FetchPayload[],
  fetches: FetchPayload[]
}

export const initialState = {
  error: null,
  erroredFetches: [],
  fetches: []
}

export const reducers = {
  [DECREMENT_FETCH](state: NetworkState, {payload}) {
    if (payload.id) {
      return {
        ...state,
        fetches: state.fetches.filter(f => f.id !== payload.id)
      }
    } else {
      return {
        ...state,
        fetches: state.fetches.filter(f => f.type !== payload.type)
      }
    }
  },
  [INCREMENT_FETCH](state: NetworkState, action) {
    return {
      ...state,
      fetches: [...state.fetches, action.payload]
    }
  },
  [FETCH_ERROR](state: NetworkState, action) {
    const {payload} = action
    const newState = {
      ...state,
      erroredFetches: [...state.erroredFetches, action.payload],
      fetches: state.fetches.filter(f => f.id !== action.id)
    }

    console.error(payload)
    if (action.error) {
      return {
        ...newState,
        error: {
          error: `Error in the client`,
          detailMessage: payload.stack
        }
      }
    } else if (payload.value && Array.isArray(payload.value)) {
      const value = payload.value[0]
      if (value.message) {
        return {
          ...newState,
          error: {
            error: value.message || 'Error on the server',
            detailMessage: value.exception
              ? exceptionToString(value.exception)
              : ''
          }
        }
      } else {
        return {
          ...newState,
          error: {
            error: value.title,
            detailMessage: value.messages[0],
            url: payload.url,
            stack: payload.value.stackTrace
          }
        }
      }
    } else {
      return {
        ...newState,
        error: {
          error: 'Error on the server',
          detailMessage: payload.value
            ? payload.value.message
            : payload.message,
          url: payload.url,
          stack: payload.value ? payload.value.stackTrace : payload.stackTrace
        }
      }
    }
  },
  'lock ui with error'(state: NetworkState, action: Action) {
    return {
      ...state,
      error: action.payload
    }
  },
  'clear error'(state: NetworkState, action: Action) {
    return {
      ...state,
      error: null
    }
  }
}

function exceptionToString(exception) {
  return `Caused by: ${exception.message || ''}\n\t${exception.stackTrace
    .map(traceToLine)
    .join('\n\t')}`
}

const traceToLine = trace =>
  `${trace.className}.${trace.methodName}(${trace.fileName}:${
    trace.lineNumber
  })`
