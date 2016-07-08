/** show selected stops on the map */

import {circleMarker, featureGroup, latLng} from 'leaflet'
import {PropTypes} from 'react'
import {Path} from 'react-leaflet'

import colors from '../colors'

export default class StopLayer extends Path {
  static defaultProps = {
    allowSelect: false,
    nullIsWildcard: false,
    unselectedColor: colors.NEUTRAL,
    selectedColor: colors.MODIFIED
  }

  static propTypes = {
    allowSelect: PropTypes.bool.isRequired,
    feed: PropTypes.object.isRequired,
    modification: PropTypes.object.isRequired,
    nullIsWildcard: PropTypes.bool.isRequired,
    selectedColor: PropTypes.string.isRequired,
    unselectedColor: PropTypes.string.isRequired
  }

  componentWillMount () {
    super.componentWillMount()
    this.leafletElement = featureGroup()
  }

  render () {
    const {allowSelect, feed, modification, nullIsWildcard, selectedColor, unselectedColor} = this.props
    const ret = super.render()

    this.leafletElement.clearLayers()

    // route has not yet been chosen
    if (modification.routes == null) return ret

    let routeStopIds = new Set()

    // data has not yet loaded
    if (!feed || modification.routes == null) return ret

    let patterns = feed.routesById[modification.routes[0]].patterns

    // data has not yet been fetched
    if (patterns === undefined) return ret

    if (modification.trips !== null) {
      patterns = patterns.filter((p) => {
        for (let trip of p.trips) {
          if (modification.trips.indexOf(trip.trip_id) > -1) return true
        }
        return false
      })
    }

    patterns.forEach((p) => {
      p.stops.forEach((s) => routeStopIds.add(s.stop_id))
    })

    const routeStops = [...routeStopIds].map((sid) => feed.stopsById[sid])

    routeStops
      .forEach((stop) => {
        let marker = circleMarker(latLng(stop.stop_lat, stop.stop_lon), {
          color: nullIsWildcard && // TODO: not this
            modification.stops == null ||
            modification.stops != null &&
            modification.stops.indexOf(stop.stop_id) > -1
              ? selectedColor
              : unselectedColor,
          radius: 4
        })

        if (allowSelect) {
          marker.on('click', (e) => this.props.onSelect(stop))
        }

        this.leafletElement.addLayer(marker)
      })

    return ret
  }
}
