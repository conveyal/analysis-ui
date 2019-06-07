import {faMinus, faPlus} from '@fortawesome/free-solid-svg-icons'
import get from 'lodash/get'
import React, {PureComponent} from 'react'

import Select from '../select'
import {Button} from '../buttons'
import Icon from '../icon'
import {Group as FormGroup} from '../input'

/**
 * Select routes without selecting patterns
 */
export default class SelectFeedAndRoutes extends PureComponent {
  _selectFeed = feed => {
    this.props.onChange({feed: get(feed, 'id'), routes: null})
  }

  _selectRoute = routes => {
    const {onChange, selectedFeed} = this.props
    onChange({
      feed: get(selectedFeed, 'id'),
      routes: !routes
        ? []
        : Array.isArray(routes)
        ? routes.map(r => (r ? r.route_id : ''))
        : [routes.route_id]
    })
  }

  _deselectAllRoutes = () => {
    const {onChange, selectedFeed} = this.props
    onChange({
      feed: get(selectedFeed, 'id'),
      routes: []
    })
  }

  _selectAllRoutes = () => {
    const {onChange, selectedFeed} = this.props
    if (selectedFeed) {
      onChange({
        feed: selectedFeed.id,
        routes: selectedFeed.routes.map(r => r.route_id)
      })
    }
  }

  render() {
    const {
      allowMultipleRoutes,
      feeds,
      selectedFeed,
      selectedRouteIds
    } = this.props

    const selectedRoutes = (selectedRouteIds || []).map(id =>
      selectedFeed.routes.find(r => r.route_id === id)
    )
    const allRoutesSelected =
      selectedFeed && selectedRoutes.length === selectedFeed.routes.length
    return (
      <>
        <FormGroup>
          <label htmlFor='Feed'>Select feed and routes</label>
          <Select
            clearable={false}
            name='Feed'
            getOptionLabel={f => f.name || f.id}
            getOptionValue={f => f.id}
            onChange={this._selectFeed}
            options={feeds}
            placeholder='Select feed'
            value={selectedFeed}
          />
        </FormGroup>

        {selectedFeed && (
          <FormGroup>
            <Select
              disabled={allRoutesSelected}
              clearable={false}
              getOptionLabel={r => r.label}
              getOptionValue={r => r.route_id}
              multi={allowMultipleRoutes}
              name='Route'
              onChange={this._selectRoute}
              options={selectedFeed.routes}
              placeholder={
                allRoutesSelected ? 'All routes selected' : 'Select route'
              }
              value={allowMultipleRoutes ? selectedRoutes : selectedRoutes[0]}
            />
          </FormGroup>
        )}

        {selectedFeed && allowMultipleRoutes && (
          <>
            {selectedRouteIds && selectedRouteIds.length > 0 && (
              <FormGroup>
                <Button block style='warning' onClick={this._deselectAllRoutes}>
                  <Icon icon={faMinus} /> Deselect all routes
                </Button>
              </FormGroup>
            )}
            {(!selectedRouteIds ||
              selectedRouteIds.length < selectedFeed.routes.length) && (
              <FormGroup>
                <Button block style='info' onClick={this._selectAllRoutes}>
                  <Icon icon={faPlus} /> Select all routes
                </Button>
              </FormGroup>
            )}
          </>
        )}
      </>
    )
  }
}
