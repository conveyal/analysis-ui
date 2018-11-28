// @flow
import Icon from '@conveyal/woonerf/components/icon'
import React, {Children, Component} from 'react'
import {Link as RouterLink} from 'react-router'

import Tip from './tip'

export default class Link extends Component {
  props: {
    children?: Children,
    className?: string,
    name?: string,
    tip?: string,
    title?: string,
    to?: string
  }

  render () {
    const {children, className, tip, to, ...p} = this.props
    return (
      <Tip className={className} tip={tip || p.title || p.name}>
        {to
          ? <RouterLink to={to} {...p}>{children}</RouterLink>
          : <a tabIndex={0} type='button' {...p}>{children}</a>}
      </Tip>
    )
  }
}

export const IconLink = ({type, ...p}: {type: string}) =>
  <Link {...p} type='button'><Icon type={type} /></Link>
