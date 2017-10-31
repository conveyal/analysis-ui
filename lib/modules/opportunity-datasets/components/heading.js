// @flow
import Icon from '@conveyal/woonerf/components/icon'
import React, {PureComponent} from 'react'

import type {Children} from 'react'

export default class Heading extends PureComponent {
  props: {
    children?: Children
  }

  render () {
    const {children} = this.props
    return (
      <div>
        <div className='ApplicationDockTitle'>
          <Icon type='th' /> Opportunity Datasets
        </div>
        <div className='InnerDock'>
          <div className='block'>{children}</div>
        </div>
      </div>
    )
  }
}
