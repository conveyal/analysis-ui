// @flow
import Icon from '@conveyal/woonerf/components/icon'
import classnames from 'classnames'
import pathToRegex from 'path-to-regexp'
import React, {PureComponent} from 'react'
import {Link} from 'react-router'
import {sprintf} from 'sprintf-js'

import messages from '../utils/messages'

type Props = {
  currentPath: string,
  outstandingRequests: number,
  projectId?: string,
  scenarioId?: string,
  username?: string
}

type State = {
  online: boolean
}

const paths = window.paths = {
  home: pathToRegex('/'),
  projects: pathToRegex('/projects'),
  editProject: pathToRegex('/projects/:projectId/edit'),
  scenarios: pathToRegex('/projects/:projectId'),
  createScenario: pathToRegex('/projects/:projectId/scenarios/create'),
  editScenario: pathToRegex('/scenarios/:scenarioId'),
  editModification: pathToRegex('/scenarios/:sid/modifications/:mid'),
  analyzeScenario: pathToRegex('/scenarios/:scenarioId/analysis/:variant')
}

export default class Sidebar extends PureComponent<void, Props, State> {
  state = {
    online: navigator.onLine
  }

  componentDidMount () {
    window.addEventListener('online', () => this.setState({online: true}))
    window.addEventListener('offline', () => this.setState({online: false}))
  }

  render () {
    const {currentPath, outstandingRequests, projectId, scenarioId, username} = this.props
    const {online} = this.state
    return (
      <div
        className='Sidebar'
        >
        {!online &&
          <SidebarNavItem
            danger
            icon='wifi'
            text='You are not connected to the internet'
            />}

        {outstandingRequests > 0
          ? <div className='Sidebar-spinner'><Icon type='spinner' className='fa-pulse' /></div>
          : <div className='Sidebar-logo' />}

        {projectId &&
          <div>
            <SidebarNavItem
              active={paths.projects.exec(currentPath) || paths.home.exec(currentPath)}
              icon='map-pin'
              text='Projects'
              href='/'
              />
            <SidebarNavItem
              active={paths.editProject.exec(currentPath)}
              icon='gear'
              text='Project Settings'
              href={`/projects/${projectId}/edit`}
              />
            <SidebarNavItem
              active={paths.scenarios.exec(currentPath) || paths.createScenario.exec(currentPath)}
              icon='cubes'
              text='Scenarios'
              href={`/projects/${projectId}`}
              />
          </div>}

        {projectId && scenarioId &&
          <div>
            <SidebarNavItem
              active={paths.editScenario.exec(currentPath) || paths.editModification.exec(currentPath)}
              icon='wrench'
              text='Edit Scenario'
              href={`/scenarios/${scenarioId}`}
              />
            <SidebarNavItem
              active={paths.analyzeScenario.exec(currentPath)}
              icon='area-chart'
              text='Conduct Analysis'
              href={`/scenarios/${scenarioId}/analysis/0`}
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
  text,
  ...props
}) {
  const className = classnames('Sidebar-navItem', {active, ...props})
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
