/** All stops by bundle scoped ID */

import {createSelector} from 'reselect'

export default createSelector(
  state => state.project.feedsById,
  feedsById =>
    Object.keys(feedsById).reduce(
      (all, feedId) => [
        ...all,
        ...feedsById[feedId].stops.map(stop => ({
          ...stop,
          stop_id: `${feedId}:${stop.stop_id}`
        }))
      ],
      []
    )
)
