// @flow
import Icon from '@conveyal/woonerf/components/icon'
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'

import {Button} from '../../../components/buttons'

import {goTo} from '../actions'

import type {Children} from 'react'

class Heading extends PureComponent {
  props: {
    children: Children,

    goToUpload: (e: Event) => void
  }

  render () {
    const {children, goToUpload} = this.props
    return (
      <div>
        <div className='ApplicationDockTitle'>
          <Icon type='th' /> Opportunity Datasets

          <Button
            onClick={goToUpload}
            style='success'
            size='sm'
          >
            <Icon type='plus' /> Upload dataset
          </Button>
        </div>
        <div className='InnerDock'>
          <div className='block'>{children}</div>
        </div>
      </div>
    )
  }
}

export default connect(null, {
  goToUpload: goTo('/upload')
})(Heading)
