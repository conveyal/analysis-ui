import {createSelector} from 'reselect'

import get from 'lib/utils/get'
import cleanProjectScenarioName from 'lib/utils/clean-project-scenario-name'

import displayedComparisonProject from './displayed-comparison-project'

export default createSelector(
  displayedComparisonProject,
  (state) => get(state, 'queryString.comparisonVariantIndex'),
  (project, variantIndex) => cleanProjectScenarioName(project, variantIndex)
)
