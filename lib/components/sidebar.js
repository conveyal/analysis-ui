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
  error: null | string,
  online: boolean
}

const paths = {
  home: pathToRegex('/'),
  projects: pathToRegex('/projects'),
  bundles: pathToRegex('/projects/:projectId/bundles/:action'),
  editProject: pathToRegex('/projects/:projectId/edit'),
  createOpportunityData: pathToRegex('/projects/:projectId/grids/create'),
  scenarios: pathToRegex('/projects/:projectId'),
  createScenario: pathToRegex('/projects/:projectId/scenarios/create'),
  editScenarioSettings: pathToRegex('/scenarios/:scenarioId/edit'),
  editScenario: pathToRegex('/scenarios/:scenarioId'),
  editModification: pathToRegex('/scenarios/:sid/modifications/:mid'),
  importModifications: pathToRegex('/scenarios/:scenarioId/import-modifications'),
  importShapefile: pathToRegex('/scenarios/:scenarioId/import-shapefile'),
  analyzeScenario: pathToRegex('/scenarios/:scenarioId/analysis'),
  analyzeScenarioVariant: pathToRegex('/scenarios/:scenarioId/analysis/:variant')
}

const isProjectPath = (p) =>
  paths.home.exec(p) ||
  paths.projects.exec(p) ||
  paths.scenarios.exec(p) ||
  paths.createScenario.exec(p)

const isEditScenarioPath = (p) =>
  paths.editScenario.exec(p) ||
  paths.editScenarioSettings.exec(p) ||
  paths.editModification.exec(p) ||
  paths.importModifications.exec(p) ||
  paths.importShapefile.exec(p)

const isAnalysisPath = (p) =>
  paths.analyzeScenario.exec(p) ||
  paths.analyzeScenarioVariant.exec(p)

export default class Sidebar extends PureComponent<void, Props, State> {
  state = {
    error: null,
    online: navigator.onLine
  }

  componentDidMount () {
    window.addEventListener('online', () => this.setState({online: true}))
    window.addEventListener('offline', () => this.setState({online: false}))
    window.addEventListener('beforeunload', (e) => {
      if (this.props.outstandingRequests > 0) {
        const returnValue = e.returnValue = messages.nav.unfinishedRequests
        return returnValue
      }
    })
    window.addEventListener('error', (error) =>
      this.setState({error: error.message}))
    window.addEventListener('unhandledrejection', (error) =>
      this.setState({error: error.reason}))
  }

  render () {
    const {currentPath, outstandingRequests, projectId, scenarioId, username} = this.props
    const {error, online} = this.state
    return (
      <div
        className='Sidebar'
        >
        {outstandingRequests > 0
          ? <div className='Sidebar-spinner'><Icon type='spinner' className='fa-spin' /></div>
          : <Link title={messages.nav.projects} to='/' className='Sidebar-logo' />}

        {projectId &&
          <div>
            <SidebarNavItem
              active={isProjectPath(currentPath)}
              icon='cubes'
              text={messages.nav.scenarios}
              href={`/projects/${projectId}`}
              />
            <SidebarNavItem
              active={paths.editProject.exec(currentPath)}
              icon='gear'
              text={messages.nav.projectSettings}
              href={`/projects/${projectId}/edit`}
              />
            <SidebarNavItem
              active={paths.bundles.exec(currentPath)}
              icon='database'
              text={messages.nav.gtfsBundles}
              href={`/projects/${projectId}/bundles/create`}
              />
            <SidebarNavItem
              active={paths.createOpportunityData.exec(currentPath)}
              icon='th'
              text={messages.nav.opportunityDatasets}
              href={`/projects/${projectId}/grids/create`}
              />
          </div>}

        {projectId && scenarioId &&
          <div>
            <SidebarNavItem
              active={isEditScenarioPath(currentPath)}
              icon='pencil'
              text={messages.nav.editScenario}
              href={`/scenarios/${scenarioId}`}
              />
            <SidebarNavItem
              active={isAnalysisPath(currentPath)}
              icon='area-chart'
              text={messages.nav.analyzeScenario}
              href={`/scenarios/${scenarioId}/analysis`}
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
            newTab
            />

          {error &&
            <SidebarNavItem
              danger
              icon='exclamation-circle'
              text={error}
              />}

          {!online &&
            <SidebarNavItem
              danger
              icon='wifi'
              text={messages.nav.notConnectedToInternet}
              />}
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
  newTab,
  ...props
}) {
  const className = classnames('Sidebar-navItem', {active, ...props})
  // TODO ftp, gopher, etc.
  const isAbsoluteUrl = href && href.startsWith('http://' || href.startsWith('https://'))
  return (
    <div className={className} title={text}>
      {href && !isAbsoluteUrl &&
        <Link to={href}>
          <Icon type={icon} /><span className='Sidebar-navItem-text'> {text}</span>
        </Link>}
      {href && isAbsoluteUrl &&
        <a href={href} target={newTab ? '_blank' : undefined}>
          <Icon type={icon} /><span className='Sidebar-navItem-text'> {text}</span>
        </a>}
      {!href &&
        <span><Icon type={icon} /><span className='Sidebar-navItem-text'> {text}</span></span>}
      {children && <div className='Sidebar-navItem-submenu'>{children}</div>}
    </div>
  )
}
