import sortBy from 'lodash/sortBy'
import {createSelector} from 'reselect'

export default createSelector(
  (state) => state.project.projects,
  (projects) => sortBy(projects, ['name'])
)
