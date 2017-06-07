// @flow
import Icon from '@conveyal/woonerf/components/icon'
import classnames from 'classnames'
import React, {PureComponent} from 'react'
import {Link} from 'react-router'
import {sprintf} from 'sprintf-js'

import messages from '../utils/messages'

type Props = {
  outstandingRequests: number,
  projectId?: string,
  scenarioId?: string,
  username?: string
}

type State = {
  expanded: boolean
}

export default class Sidebar extends PureComponent<void, Props, State> {
  state = {
    expanded: false
  }

  _expandSidebar = () =>
    this.setState({expanded: true})

  _collapseSidebar = (e: MouseEvent & {
    currentTarget: HTMLElement,
    target: HTMLElement
  }) => {
    if (!e.currentTarget.contains(e.target)) {
      this.setState({expanded: false})
    }
  }

  render () {
    const {outstandingRequests, projectId, scenarioId, username} = this.props
    const {expanded} = this.state
    const sidebarClassName = classnames('Sidebar', {expanded})
    return (
      <div
        className={sidebarClassName}
        >
        {outstandingRequests > 0
          ? <div className='Sidebar-spinner'><Icon type='spinner' className='fa-pulse' /></div>
          : <div className='Sidebar-logo' />}

        {projectId &&
          <div>
            <SidebarNavItem
              active
              icon='map-pin'
              text='Projects'
              href='/'
              />
            <SidebarNavItem
              icon='gear'
              text='Project Settings'
              href={`/projects/${projectId}/edit`}
              />
            <SidebarNavItem
              icon='cubes'
              text='Scenarios'
              href={`/projects/${projectId}`}
              />
          </div>}

        {projectId && scenarioId &&
          <div>
            <SidebarNavItem
              icon='wrench'
              text='Edit Scenario'
              href={`/projects/${projectId}/scenarios/${scenarioId}`}
              />
            <SidebarNavItem
              icon='area-chart'
              text='Conduct Analysis'
              href={`/projects/${projectId}/scenarios/${scenarioId}/analysis/0`}
              />
          </div>}

        <div className='Sidebar-bottom'>
          {username &&
            <SidebarNavItem
              icon='sign-out'
              text={`${messages.authentication.logOut} — ${sprintf(messages.authentication.username, username)}`}
              href='/logout'
            />}
          <SidebarNavItem
            icon='question-circle'
            text={messages.common.help}
            href='http://docs.analysis.conveyal.com/'
            />
        </div>
      </div>
    )
  }
}

function SidebarNavItem ({
  active,
  children,
  icon,
  href,
  text
}) {
  const className = classnames('Sidebar-navItem', {active})
  return (
    <div className={className} title={text}>
      {href &&
        <Link to={href}>
          <Icon type={icon} /><span className='Sidebar-navItem-text'> {text}</span>
        </Link>}
      {!href &&
        <span><Icon type={icon} /><span className='Sidebar-navItem-text'> {text}</span></span>}
      {children && <div className='Sidebar-navItem-submenu'>{children}</div>}
    </div>
  )
}
