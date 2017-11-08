// @flow
import {createSelector} from 'reselect'
import sortBy from 'lodash/sortBy'

export default createSelector(
  (state) => state.scenario && state.scenario.modifications,
  (modifications = []) => sortBy(modifications, ['type', 'name'])
)
