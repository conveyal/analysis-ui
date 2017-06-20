// @flow
import React, {PureComponent} from 'react'
import Select from 'react-select'

import {Group as FormGroup} from '../input'

import type {Feed, ReactSelectMultiOptions, ReactSelectOption} from '../../types'

type Props = {
  allowMultipleRoutes?: boolean,
  feeds: Feed[],
  onChange: ({
    feed: null | string,
    routes: null | string[]
  }) => void,
  selectedFeed: null | Feed,
  selectedRouteIds: null | string[]
}

/**
 * Select routes without selecting patterns
 */
export default class SelectFeedAndRoutes extends PureComponent<void, Props, void> {
  _selectFeed = (feed: ReactSelectOption) => {
    this.props.onChange({feed: feed ? feed.value : null, routes: null})
  }

  _selectRoute = (routes: ReactSelectMultiOptions | ReactSelectOption) => {
    const {onChange, selectedFeed} = this.props
    onChange({
      feed: selectedFeed ? selectedFeed.id : null,
      routes: !routes
        ? []
        : Array.isArray(routes)
          ? routes.map((r) => r.value)
          : [routes.value]
    })
  }

  render () {
    const {allowMultipleRoutes, feeds, selectedFeed, selectedRouteIds} = this.props
    const value = selectedFeed ? selectedFeed.id : undefined
    return (
      <div>
        <FormGroup>
          <Select
            clearable={false}
            name='Feed'
            onChange={this._selectFeed}
            options={feeds.map((f) => { return { value: f.id, label: f.id } })}
            placeholder='Select feed'
            value={value}
            />
        </FormGroup>

        {selectedFeed &&
          <FormGroup>
            <Select
              clearable={false}
              multi={allowMultipleRoutes}
              name='Route'
              onChange={this._selectRoute}
              options={selectedFeed.routes.map((r) => { return { value: r.route_id, label: r.label } })}
              placeholder='Select route'
              value={allowMultipleRoutes
                ? selectedRouteIds
                : selectedRouteIds && selectedRouteIds[0]}
              />
          </FormGroup>}
      </div>
    )
  }
}
