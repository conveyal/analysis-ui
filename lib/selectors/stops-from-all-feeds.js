// @flow
import {createSelector} from 'reselect'

export default createSelector(
  state => state.project.feeds,
  feeds => {
    return [].concat(
      ...feeds.map(feed =>
        feed.stops.map(gtfsStop => ({
          stop_id: `${feed.id}:${gtfsStop.stop_id}`,
          stop_lat: gtfsStop.stop_lat,
          stop_lon: gtfsStop.stop_lon,
          stop_name: gtfsStop.stop_name
        }))
      )
    )
  }
)
