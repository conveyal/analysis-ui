/**
 * Main entry point for the scenario editor
 * @author mattwigway
 */

import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'

import bootstrap from './bootstrap'
import ScenarioEditor from './scenario-editor'
import store from './store'
// browserify-css packs the css using this file
import './styles.css'

bootstrap(store)

// initialize the application
ReactDOM.render(
  <Provider store={store}>
    <ScenarioEditor />
  </Provider>,
  document.getElementById('root'))
