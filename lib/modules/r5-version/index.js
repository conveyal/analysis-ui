// @flow
import * as actions from './actions'
import * as components from './components'
import * as constants from './constants'
import reducer from './reducer'
import * as select from './selectors'

const R5Version = {actions, components, reducer, select, ...constants}

// TODO Expose for command line usage
// if (typeof window !== undefined) window.R5Version = R5Version

export default R5Version
