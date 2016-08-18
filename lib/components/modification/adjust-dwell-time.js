/** Change dwell times */

import React, { Component, PropTypes } from 'react'

import {Number as InputNumber} from '../input'
import SelectFeedRouteAndPatterns from '../select-feed-route-and-patterns'
import SelectStops from '../select-stops'

export default class AdjustDwellTime extends Component {
  static propTypes = {
    addControl: PropTypes.func,
    addLayer: PropTypes.func,
    feeds: PropTypes.array.isRequired,
    feedsById: PropTypes.object.isRequired,
    modification: PropTypes.object.isRequired,
    removeControl: PropTypes.func,
    removeLayer: PropTypes.func,
    replaceModification: PropTypes.func.isRequired,
    setMapState: PropTypes.func
  }

  onPatternSelectorChange = ({feed, routes, trips}) => {
    this.props.replaceModification(Object.assign({}, this.props.modification, { feed, routes, trips, stops: null }))
  }

  /** we are setting a scale for existing speeds, not an actual speed */
  setScale = (e) => {
    if (e.target.checked) this.props.replaceModification(Object.assign({}, this.props.modification, { scale: true }))
  }

  /** we are setting a brand-new speed, throwing out any existing variation in speed */
  setSpeed = (e) => {
    if (e.target.checked) this.props.replaceModification(Object.assign({}, this.props.modification, { scale: false }))
  }

  /** set the factor by which we are scaling, or the speed which we are replacing */
  setValue = (e) => {
    this.props.replaceModification(Object.assign({}, this.props.modification, { value: e.target.value }))
  }

  render () {
    const {feeds, feedsById, modification} = this.props
    return (
      <div>
        <SelectFeedRouteAndPatterns
          feed={feedsById[modification.feed]}
          feeds={feeds}
          onChange={this.onPatternSelectorChange}
          routes={modification.routes}
          trips={modification.trips}
          />

        {modification.routes &&
          <SelectStops
            feed={feedsById[modification.feed]}
            modification={modification}
            nullIsWildcard
            replaceModification={this.props.replaceModification}
            setMapState={this.props.setMapState}
            />
        }

        <br />

        <div className='form-group'>
          <label className='radio-inline'><input type='radio' value='scale' checked={modification.scale} onChange={this.setScale} />Scale existing dwell times by</label>
          <label className='radio-inline'><input type='radio' value='speed' checked={!modification.scale} onChange={this.setSpeed} />Set new dwell time to</label>
        </div>

        <InputNumber
          onChange={this.setValue}
          value={modification.value}
          />
      </div>
    )
  }
}
