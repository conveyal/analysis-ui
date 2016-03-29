/** reroute an existing line. Takes a start and end stop ID, and replaces all stops between those with the specified routing/set of stops */

import React, { Component, PropTypes } from 'react'
import uuid from 'uuid'
import SelectRouteAndPatterns from './select-route-and-patterns'

export default class AddStops extends Component {
  static propTypes = {
    modification: PropTypes.object.isRequired,
    replaceModification: PropTypes.func.isRequired,
    setMapState: PropTypes.func.isRequired,
    data: PropTypes.object
  };

  constructor (props) {
    super(props)

    this.onNameChange = this.onNameChange.bind(this)
    this.onSelectorChange = this.onSelectorChange.bind(this)
    this.selectFromStop = this.selectFromStop.bind(this)
    this.selectToStop = this.selectToStop.bind(this)
  }

  onNameChange (e) {
    this.props.replaceModification(Object.assign({}, this.props.modification, { name: e.target.value }))
  }

  onSelectorChange (value) {
    let { feed, routes, trips } = value
    let modification = Object.assign({}, this.props.modification, { feed, routes, trips })
    this.props.replaceModification(modification)
  }

  selectFromStop (e) {
    this.props.setMapState({
      state: 'single-stop-selection',
      modification: this.props.modification,
      which: 'fromStop'
    })
  }

  selectToStop (e) {
    this.props.setMapState({
      state: 'single-stop-selection',
      modification: this.props.modification,
      which: 'toStop'
    })
  }

  render () {
    return <div>
      <input type='text' placeholder='name' value={this.props.modification.name} onChange={this.onNameChange} />

      <SelectRouteAndPatterns routes={this.props.modification.routes} feed={this.props.modification.feed} trips={this.props.modification.trips} onChange={this.onSelectorChange} data={this.props.data} />

      {(() => {
        if (this.props.modification.feed && this.props.modification.routes) {
          let feed = this.props.data.feeds.get(this.props.modification.feed)
          if (feed == null) return <span></span> // data not loaded

          return <div>
            <div>
              From stop: { this.props.modification.fromStop != null ? feed.stops.get(this.props.modification.fromStop).stop_name : '(none)' } <button onClick={this.selectFromStop}>Select</button>
            </div>

            <div>
              To stop: { this.props.modification.toStop != null ? feed.stops.get(this.props.modification.toStop).stop_name : '(none)' } <button onClick={this.selectToStop}>Select</button>
            </div>
          </div>
        } else return <span></span>
      })()}

      <button onClick={this.editAlignment}>Edit alignment</button>
    </div>
  }
}

export function create () {
  return {
    type: 'add-stops',
    fromStopId: null,
    toStopId: null,
    feed: null,
    routes: null,
    name: '',
    showOnMap: true,
    expanded: true,
    id: uuid.v4()
  }
}
