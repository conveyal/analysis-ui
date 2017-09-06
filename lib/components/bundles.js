// @flow
import Icon from '@conveyal/woonerf/components/icon'
import memoize from 'lodash/memoize'
import React, {Component} from 'react'

import type {Bundle} from '../types'

type Props = {
  bundles: Bundle[],
  goToEditBundle: (id: string) => void
}

export default class Bundles extends Component {
  props: Props

  _goToEditBundle = memoize((id) => () => this.props.goToEditBundle(id))

  render () {
    const {bundles} = this.props
    return (
      <div>
        <div className='ApplicationDockTitle'>
          <Icon type='database' /> GTFS Bundles
        </div>
        <div className='InnerDock'>
          <br />
          <div className='list-group block'>
            {bundles.map((bundle) => <a
              className='list-group-item'
              onClick={this._goToEditBundle(bundle.id)}
              key={`bundle-${bundle.id}`}
              tabIndex={0}
              title='Edit Bundle'
              >
              <h5 className='list-group-item-heading'>{bundle.name}</h5>
              <p className='list-group-item-text'><strong>Feeds:</strong> {bundle.totalFeeds}</p>
            </a>)}
          </div>
        </div>
      </div>
    )
  }
}
