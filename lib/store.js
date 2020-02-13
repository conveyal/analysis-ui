import {applyMiddleware, combineReducers, createStore} from 'redux'
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk'

import reducers from './reducers'
import multi from './utils/multi'

const isServer = typeof window === 'undefined'
const middlewares = [multi, thunkMiddleware]

/**
 * Configure the Redux store with middleware, reducers, and a derived initial
 * state. Only add the logging middleware on the client side.
 */
export default function configureStore(initialState) {
  if (!isServer) {
    middlewares.push(createLogger({collapsed: true, duration: true}))
  }

  return createStore(
    combineReducers(reducers),
    initialState,
    applyMiddleware(...middlewares)
  )
}
