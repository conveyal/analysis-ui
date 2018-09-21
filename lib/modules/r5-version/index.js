// @flow
import * as actions from './actions'
import * as components from './components'
import * as constants from './constants'
import reducer from './reducer'
import * as select from './selectors'

const R5Version = {actions, components, reducer, select, ...constants}

// Expose for command line usage
if (window) window.R5Version = R5Version

export default R5Version
