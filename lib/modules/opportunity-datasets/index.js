// @flow
import * as actions from './actions'
import * as components from './components'
import reducer from './reducer'
import * as selectors from './selectors'

const OpportunityDatasets = {actions, components, reducer, selectors}

// Expose for command line usage
if (window) window.OpportunityDatasets = OpportunityDatasets

export default OpportunityDatasets
