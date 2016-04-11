/** show selected stops on the map */

import { Path } from 'react-leaflet'
import colors from '../colors'
import { featureGroup, circleMarker, latLng } from 'leaflet'

export default class StopLayer extends Path {
  static defaultProps = {
    unselectedColor: colors.NEUTRAL,
    selectedColor: colors.MODIFIED,
    nullIsWildcard: false,
    allowSelect: false
  };

  componentWillMount () {
    super.componentWillMount()
    this.leafletElement = featureGroup()
  }

  render () {
    let ret = super.render()

    this.leafletElement.clearLayers()

    // route has not yet been chosen
    if (this.props.modification.routes == null) return ret

    let routeStopIds = new Set()

    // data has not yet loaded
    if (!this.props.data.feeds[this.props.modification.feed] || this.props.modification.routes == null) return ret

    let patterns = this.props.data.feeds[this.props.modification.feed].routes.get(this.props.modification.routes[0]).patterns

    // data has not yet been fetched
    if (patterns === undefined) return ret

    if (this.props.modification.trips !== null) {
      patterns = patterns.filter((p) => {
        for (let trip of p.trips) {
          if (this.props.modification.trips.indexOf(trip.trip_id) > -1) return true
        }
        return false
      })
    }

    patterns.forEach((p) => {
      p.stops.forEach((s) => routeStopIds.add(s.stop_id))
    })

    let feed = this.props.data.feeds[this.props.modification.feed]
    let routeStops = [...routeStopIds].map((sid) => feed.stops.get(sid))

    routeStops
      .forEach((stop) => {
        let marker = circleMarker(latLng(stop.stop_lat, stop.stop_lon), {
          color: this.props.nullIsWildcard && // TODO: not this
            this.props.modification.stops == null ||
            this.props.modification.stops != null &&
            this.props.modification.stops.indexOf(stop.stop_id) > -1
              ? this.props.selectedColor
              : this.props.unselectedColor,
          radius: 4
        })

        if (this.props.allowSelect) {
          marker.on('click', (e) => this.props.onSelect(stop))
        }

        this.leafletElement.addLayer(marker)
      })

    return ret
  }
}
