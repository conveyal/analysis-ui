/** Manage the Redux store */

import { createStore } from 'redux'
import {SET_LOCATION} from './action-types'

/** the main reducer */
function reduce (state = {what: 'world'}, action) {
  switch (action.type) {
    case SET_LOCATION:
      return Object.assign({}, state, {what: action.what})
  }
  return state
}

let store = createStore(reduce)

// debug: log state changes
store.subscribe(() => console.log(store.getState()))

export default store
