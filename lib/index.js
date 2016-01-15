/**
 * Main entry point for the scenario editor
 * @author mattwigway
 */

import React from 'react'
import ReactDOM from 'react-dom'
import ScenarioEditor from './scenario-editor'

export function start () {
  console.log('starting scenario editor')

  // initialize the application
  ReactDOM.render(<ScenarioEditor />, document.getElementById('root'))
}
