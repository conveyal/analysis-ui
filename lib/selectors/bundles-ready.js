import {createSelector} from 'reselect'

import selectBundles from './bundles'

export default createSelector(
  selectBundles,
  bundles => bundles.filter(b => b.status === 'DONE')
)
