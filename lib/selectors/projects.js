import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import {createSelector} from 'reselect'

export default createSelector(
  (state) => get(state, 'project.projects', []),
  (regions) => sortBy(regions, ['name'])
)
