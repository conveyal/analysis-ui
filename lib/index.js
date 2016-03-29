/**
 * Main entry point for the scenario editor
 * @author mattwigway
 */

import React from 'react'
import ReactDOM from 'react-dom'
import ScenarioEditor from './scenario-editor'
import { Provider } from 'react-redux'
import store from './store'
// browserify-css packs the css using this file
import './styles.css'

console.log('starting scenario editor')

// initialize the application
ReactDOM.render(
  <Provider store={store}>
    <ScenarioEditor />
  </Provider>,
  document.getElementById('root'))
