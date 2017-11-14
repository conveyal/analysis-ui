// @flow
import * as actions from './actions'
import * as components from './components'
import reducer from './reducer'
import * as selectors from './selectors'

const R5Version = {actions, components, reducer, selectors}

// Expose for command line usage
if (window) window.R5Version = R5Version

export default R5Version
