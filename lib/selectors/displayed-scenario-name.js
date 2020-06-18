import {createSelector} from 'reselect'

import get from '../utils/get'
import cleanProjectScenarioName from '../utils/clean-project-scenario-name'

import displayedProject from './displayed-project'

export default createSelector(
  displayedProject,
  (state) => get(state, 'analysis.requestsSettings[0].variantIndex'),
  (project, variantIndex) => cleanProjectScenarioName(project, variantIndex)
)
