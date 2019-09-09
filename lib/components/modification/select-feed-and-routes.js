import {faMinus, faPlus} from '@fortawesome/free-solid-svg-icons'
import get from 'lodash/get'
import React from 'react'

import Select from '../select'
import {Button} from '../buttons'
import Icon from '../icon'
import {Group as FormGroup} from '../input'

/**
 * Select routes without selecting patterns
 */
export default function SelectFeedAndRoutes(p) {
  function _selectFeed(feed) {
    p.onChange({feed: get(feed, 'id'), routes: null})
  }

  function _selectRoute(routes) {
    p.onChange({
      feed: get(p.selectedFeed, 'id'),
      routes: !routes
        ? []
        : Array.isArray(routes)
        ? routes.map(r => (r ? r.route_id : ''))
        : [routes.route_id]
    })
  }

  function _deselectAllRoutes() {
    p.onChange({
      feed: get(p.selectedFeed, 'id'),
      routes: []
    })
  }

  function _selectAllRoutes() {
    if (p.selectedFeed) {
      p.onChange({
        feed: p.selectedFeed.id,
        routes: p.selectedFeed.routes.map(r => r.route_id)
      })
    }
  }

  const selectedRoutes = (p.selectedRouteIds || []).map(id =>
    p.selectedFeed.routes.find(r => r.route_id === id)
  )
  const allRoutesSelected =
    p.selectedFeed && selectedRoutes.length === p.selectedFeed.routes.length
  return (
    <>
      <FormGroup>
        <label htmlFor='Feed'>Select feed and routes</label>
        <Select
          name='Feed'
          getOptionLabel={f => get(f, 'name', f.id)}
          getOptionValue={f => f.id}
          onChange={_selectFeed}
          options={p.feeds}
          placeholder='Select feed'
          value={p.selectedFeed}
        />
      </FormGroup>

      {p.selectedFeed && !allRoutesSelected && (
        <FormGroup>
          <Select
            getOptionLabel={r => r.label}
            getOptionValue={r => r.route_id}
            isMulti={p.allowMultipleRoutes}
            name='Route'
            onChange={_selectRoute}
            options={p.selectedFeed.routes}
            placeholder='Select route'
            value={p.allowMultipleRoutes ? selectedRoutes : selectedRoutes[0]}
          />
        </FormGroup>
      )}

      {p.selectedFeed && p.allowMultipleRoutes && (
        <>
          {get(p.selectedRouteIds, 'length') > 0 && (
            <FormGroup>
              <Button block style='warning' onClick={_deselectAllRoutes}>
                <Icon icon={faMinus} /> Deselect all routes
              </Button>
            </FormGroup>
          )}
          {(!p.selectedRouteIds ||
            p.selectedRouteIds.length < p.selectedFeed.routes.length) && (
            <FormGroup>
              <Button block style='info' onClick={_selectAllRoutes}>
                <Icon icon={faPlus} /> Select all routes
              </Button>
            </FormGroup>
          )}
        </>
      )}
    </>
  )
}
