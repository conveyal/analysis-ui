import {browserHistory} from 'react-router'
import {routerMiddleware} from 'react-router-redux'
import {applyMiddleware, compose, createStore} from 'redux'
import createLogger from 'redux-logger'
import promise from 'redux-promise'

import multi from './multi'
import rootReducer from '../reducers'

const logger = createLogger({
  collapsed: true,
  duration: true
})

export default function configureStore (initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(routerMiddleware(browserHistory), multi, promise, logger)
    )
  )

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers')
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
