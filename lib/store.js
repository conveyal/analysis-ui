import multi from '@conveyal/woonerf/store/multi'
import {applyMiddleware, combineReducers, createStore} from 'redux'
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk'

import reducers from './reducers'

const isServer = typeof window === 'undefined'
const __NRS__ = 'AnalysisStore'
const middlewares = [multi, thunkMiddleware]

/**
 * Configure the Redux store with middleware, reducers, and a derived initial
 * state. Only add the logging middleware on the client side.
 */
function configureStore(initialState) {
  if (!isServer) {
    middlewares.push(createLogger({collapsed: true, duration: true}))
  }

  return createStore(
    combineReducers(reducers),
    initialState,
    applyMiddleware(...middlewares)
  )
}

/**
 * Get or create the redux store.
 */
export default function getOrCreateStore(initialState) {
  // Always make a new store if server, otherwise state is shared between requests
  if (isServer) return configureStore(initialState)

  // Return the store if it has already been created in the client
  if (window[__NRS__]) return window[__NRS__]

  // Create the store for the client
  window[__NRS__] = configureStore(initialState)

  return window[__NRS__]
}
