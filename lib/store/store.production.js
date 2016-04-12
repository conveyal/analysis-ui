import {applyMiddleware, compose, createStore} from 'redux'
import promises from 'redux-promise'

import rootReducer from '../reducers'

export default function configureStore (initialState) {
  return createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(promises)
    )
  )
}
