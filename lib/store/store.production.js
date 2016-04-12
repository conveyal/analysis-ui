import {applyMiddleware, compose, createStore} from 'redux'
import promises from 'redux-promise'

import rootReducer from '../reducers'

const finalCreateStore = compose(
  applyMiddleware(promises)
)(createStore)

export default function configureStore (initialState) {
  return finalCreateStore(rootReducer, initialState)
}
