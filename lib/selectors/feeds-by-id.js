import groupBy from 'lodash/groupBy'
import {createSelector} from 'reselect'

export default createSelector(
  state => state.project.feeds,
  feeds => groupBy(feeds, 'id')
)
