// @flow
import Icon from '@conveyal/woonerf/components/icon'
import React, {Component} from 'react'

import messages from '../utils/messages'

import type {Region} from '../types'

type Props = {
  children: ?any,
  region?: Region,

  clearCurrentRegion: () => void,
}

export default class RegionComponent extends Component {
  props: Props

  componentWillUnmount () {
    this.props.clearCurrentRegion()
  }

  render () {
    const {children, region} = this.props

    return region
      ? <div>
        <div className='ApplicationDockTitle'>
          <Icon type='cubes' /> {region.name}
        </div>

        {children}
      </div>
      : <div className='block'>
        {messages.region.loadingRegion}
      </div>
  }
}
