/** Manage the Redux store */

import {applyMiddleware, compose, createStore} from 'redux'
import logger from 'redux-logger'
import promises from 'redux-promise'

import rootReducer from '../reducers'

const finalCreateStore = compose(
  applyMiddleware(promises, logger())
)(createStore)

export default function configureStore (initialState) {
  const store = finalCreateStore(rootReducer, initialState)

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers')
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
