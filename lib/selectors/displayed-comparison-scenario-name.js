import {createSelector} from 'reselect'

import get from '../utils/get'
import displayedComparisonProject from './displayed-comparison-project'
import cleanProjectScenarioName from '../utils/clean-project-scenario-name'

export default createSelector(
  displayedComparisonProject,
  state => get(state, 'analysis.displayedProfileRequest.comparisonVariant'),
  (project, variantIndex) => cleanProjectScenarioName(project, variantIndex)
)
