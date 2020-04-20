import keyBy from 'lodash/keyBy'
import {createSelector} from 'reselect'

export default createSelector(
  (state) => state.project.feeds,
  (feeds) => keyBy(feeds, 'id')
)
