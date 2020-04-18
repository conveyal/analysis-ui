//
import {createSelector} from 'reselect'

/** All stops by bundle scoped ID */
export default createSelector(
  (state) => state.project.feeds,
  (feeds) =>
    feeds.reduce(
      (all, feed) => [
        ...all,
        ...feed.stops.map((stop) => ({
          ...stop,
          stop_id: `${feed.id}:${stop.stop_id}`
        }))
      ],
      []
    )
)
