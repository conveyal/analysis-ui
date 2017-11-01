// @flow
import Icon from '@conveyal/woonerf/components/icon'
import React, {Children, Component} from 'react'
import {Link as RouterLink} from 'react-router'

import Tip from './tip'

export default class Link extends Component {
  props: {
    className?: string,
    children?: Children,
    title?: string,
    tip?: string,
    to?: string
  }

  render () {
    const {children, className, tip, title, to, ...props} = this.props
    return (
      <Tip className={className} tip={tip || title}>
        {to
          ? <RouterLink to={to} {...props}>{children}</RouterLink>
          : <a tabIndex={0} type='button' {...props}>{children}</a>}
      </Tip>
    )
  }
}

export const IconLink = ({type, ...props}: {type: string, props?: any}) =>
  <Link {...props} type='button'><Icon type={type} /></Link>
