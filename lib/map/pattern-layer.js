/** Display patterns on the map */

import { Path } from 'react-leaflet'
import { geoJson, featureGroup } from 'leaflet'
import colors from '../colors'

export default class PatternLayer extends Path {
  static defaultProps = {
    color: colors.NEUTRAL
  };

  componentWillMount () {
    super.componentWillMount()
    this.leafletElement = featureGroup()
  }

  render () {
    let ret = super.render()

    this.leafletElement.clearLayers()

    let feed = this.props.data.get(this.props.modification.feed)

    // data has not loaded
    if (feed === undefined) return ret

    let patterns = feed.routes.get(this.props.modification.routes[0]).patterns

    // data has not loaded
    if (patterns === undefined) return ret

    if (this.props.modification.trips !== null) {
      patterns = patterns.filter((pat) => pat.trips.findIndex((t) => this.props.modification.trips.indexOf(t.trip_id) > -1) > -1)
    }

    let geometry = {
      type: 'FeatureCollection',
      features: patterns.map((pat) => {
        return {
          type: 'Feature',
          geometry: pat.geometry
        }
      })
    }

    this.leafletElement.addLayer(geoJson(geometry, {
      style: {
        color: this.props.color,
        weight: 3
      }
    }))

    return ret
  }
}
