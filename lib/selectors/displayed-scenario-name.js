import {createSelector} from 'reselect'

import get from '../utils/get'
import displayedProject from './displayed-project'
import cleanProjectScenarioName from '../utils/clean-project-scenario-name'

export default createSelector(
  displayedProject,
  state => get(state, 'analysis.displayedProfileRequest.variantIndex'),
  (project, variantIndex) => cleanProjectScenarioName(project, variantIndex)
)
