let createStore = null
if (process.env.NODE_ENV === 'production') {
  createStore = require('./store.production')
} else {
  createStore = require('./store.development')
}

const initialState = JSON.parse(process.env.STORE)
const storedState = JSON.parse(window.localStorage.getItem('state')) || {}

module.exports = createStore(Object.assign(initialState, storedState))
