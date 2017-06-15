// @flow
import {createSelector} from 'reselect'

export default createSelector(
  (state) => state.project.r5versions,
  (r5versions) => r5versions && r5versions.all
)
