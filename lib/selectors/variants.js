//
import {createSelector} from 'reselect'

import selectCurrentProject from './current-project'

export default createSelector(selectCurrentProject, (project) =>
  project ? project.variants : []
)
