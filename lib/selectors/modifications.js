// @flow
import {createSelector} from 'reselect'
import sortBy from 'lodash/sortBy'

export default createSelector(
  (state) => state.project && state.project.modifications,
  (modifications = []) => sortBy(modifications, ['type', 'name'])
)
