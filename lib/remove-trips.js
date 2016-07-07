/** Select routes or trips to remove */

import React, {Component, PropTypes} from 'react'

import SelectFeedRouteAndPatterns from './select-feed-route-and-patterns'

export default class RemoveTrips extends Component {
  static propTypes = {
    feedsById: PropTypes.object.isRequired,
    feeds: PropTypes.array.isRequired,
    modification: PropTypes.object.isRequired,
    replaceModification: PropTypes.func.isRequired
  };

  onNameChange = (e) => {
    const {modification, replaceModification} = this.props
    replaceModification(Object.assign({}, modification, { name: e.target.value }))
  }

  onSelectorChange = ({feed, routes, trips}) => {
    const {modification, replaceModification} = this.props
    replaceModification(Object.assign({}, modification, { feed, routes, trips }))
  }

  render () {
    const {feeds, feedsById, modification, name} = this.props
    return (
      <form>
        <div className='form-group'>
          <input
            className='form-control'
            onChange={this.onNameChange}
            placeholder='Name'
            type='text'
            value={name}
            />
        </div>
        <SelectFeedRouteAndPatterns
          feeds={feeds}
          onChange={this.onSelectorChange}
          routes={modification.routes}
          selectedFeed={feedsById[modification.feed]}
          trips={modification.trips}
          />
      </form>
    )
  }
}
