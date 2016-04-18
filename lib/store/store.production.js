import {browserHistory} from 'react-router'
import {routerMiddleware} from 'react-router-redux'
import {applyMiddleware, compose, createStore} from 'redux'

import multi from './multi'
import promise from './promise'
import rootReducer from '../reducers'

export default function configureStore (initialState) {
  return createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(routerMiddleware(browserHistory), multi, promise)
    )
  )
}
