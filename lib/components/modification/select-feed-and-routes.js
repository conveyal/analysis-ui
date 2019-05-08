//
import {faMinus, faPlus} from '@fortawesome/free-solid-svg-icons'
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
    this.props.onChange({feed: feed ? feed.value : null, routes: null})
  }

  _selectRoute = routes => {
    const {onChange, selectedFeed} = this.props
    onChange({
      feed: selectedFeed ? selectedFeed.id : null,
      routes: !routes
        ? []
        : Array.isArray(routes)
        ? routes.map(r => (r ? r.value : ''))
        : [routes.value]
    })
  }

  _deselectAllRoutes = () => {
    const {onChange, selectedFeed} = this.props
    onChange({
      feed: selectedFeed ? selectedFeed.id : null,
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
    const value = selectedFeed ? selectedFeed.id : undefined
    const allRoutesSelected =
      selectedFeed &&
      selectedRouteIds &&
      selectedRouteIds.length === selectedFeed.routes.length
    return (
      <div>
        <FormGroup>
          <label htmlFor='Feed'>Select feed and routes</label>
          <Select
            clearable={false}
            name='Feed'
            onChange={this._selectFeed}
            options={feeds.map(f => {
              return {value: f.id, label: f.name || f.id}
            })}
            placeholder='Select feed'
            value={value}
          />
        </FormGroup>

        {selectedFeed && (
          <FormGroup>
            <Select
              disabled={allRoutesSelected}
              clearable={false}
              multi={allowMultipleRoutes}
              name='Route'
              onChange={this._selectRoute}
              options={selectedFeed.routes.map(r => {
                return {value: r.route_id, label: r.label}
              })}
              placeholder={
                allRoutesSelected ? 'All routes selected' : 'Select route'
              }
              value={
                !allRoutesSelected &&
                (allowMultipleRoutes
                  ? selectedRouteIds
                  : selectedRouteIds && selectedRouteIds[0])
              }
            />
          </FormGroup>
        )}

        {selectedFeed && allowMultipleRoutes && (
          <div>
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
          </div>
        )}
      </div>
    )
  }
}
