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
  bundles: pathToRegex('/projects/:projectId/bundles'),
  bundleActions: pathToRegex('/projects/:projectId/bundles/:action'),
  editProject: pathToRegex('/projects/:projectId/edit'),
  createOpportunityData: pathToRegex('/projects/:projectId/grids/create'),
  scenarios: pathToRegex('/projects/:projectId'),
  createScenario: pathToRegex('/projects/:projectId/scenarios/create'),
  editScenarioSettings: pathToRegex('/scenarios/:scenarioId/edit'),
  editScenario: pathToRegex('/scenarios/:scenarioId'),
  editModification: pathToRegex('/scenarios/:sid/modifications/:mid'),
  importModifications: pathToRegex(
    '/scenarios/:scenarioId/import-modifications'
  ),
  importShapefile: pathToRegex('/scenarios/:scenarioId/import-shapefile'),
  analyzeScenario: pathToRegex('/scenarios/:scenarioId/analysis'),
  analyzeScenarioVariant: pathToRegex(
    '/scenarios/:scenarioId/analysis/:variant'
  ),
  allRegionalAnalysis: pathToRegex('/scenarios/:scenarioId/regional'),
  regionalAnalysis: pathToRegex('/scenarios/:scenarioId/regional/:regionalId')
}

const isBundlePath = p =>
  paths.bundles.exec(p) ||
  paths.bundleActions.exec(p)

const isProjectPath = p =>
  paths.home.exec(p) ||
  paths.projects.exec(p) ||
  paths.scenarios.exec(p) ||
  paths.createScenario.exec(p)

const isEditScenarioPath = p =>
  paths.editScenario.exec(p) ||
  paths.editScenarioSettings.exec(p) ||
  paths.editModification.exec(p) ||
  paths.importModifications.exec(p) ||
  paths.importShapefile.exec(p)

const isRegionalPath = p =>
  paths.allRegionalAnalysis.exec(p) ||
  paths.regionalAnalysis.exec(p)

const isAnalysisPath = p =>
  paths.analyzeScenario.exec(p) || paths.analyzeScenarioVariant.exec(p)

export default class Sidebar extends PureComponent {
  props: Props
  state: State

  state = {
    error: null,
    online: navigator.onLine
  }

  componentDidMount () {
    // TODO: Check to see if it can communicate with the backend, not just the internet (for local development)
    window.addEventListener('online', () => this.setState({online: true}))
    window.addEventListener('offline', () => this.setState({online: false}))
    window.addEventListener('beforeunload', e => {
      if (this.props.outstandingRequests > 0) {
        const returnValue = (e.returnValue = messages.nav.unfinishedRequests)
        return returnValue
      }
    })
    window.addEventListener('error', error =>
      this.setState({error: error.message})
    )
    window.addEventListener('unhandledrejection', error =>
      this.setState({error: error.reason.stack})
    )
  }

  render () {
    const {
      currentPath,
      outstandingRequests,
      projectId,
      scenarioId,
      username
    } = this.props
    const {error, online} = this.state
    return (
      <div className='Sidebar'>
        {outstandingRequests > 0
          ? <div className='Sidebar-spinner'>
            <Icon type='spinner' className='fa-spin' />
          </div>
          : <Link
            title={messages.nav.projects}
            to='/'
            className='Sidebar-logo'
            />}

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
              active={isBundlePath(currentPath)}
              icon='database'
              text={messages.nav.gtfsBundles}
              href={`/projects/${projectId}/bundles`}
            />
            <SidebarNavItem
              active={paths.createOpportunityData.exec(currentPath)}
              icon='th'
              text={messages.nav.opportunityDatasets}
              href={`/projects/${projectId}/grids/create`}
            />
          </div>}

        {projectId &&
          scenarioId &&
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
            <SidebarNavItem
              active={isRegionalPath(currentPath)}
              icon='server'
              text='Regional Analysis'
              href={`/scenarios/${scenarioId}/regional`}
            />
          </div>}

        <div className='Sidebar-bottom'>
          {username &&
            <SidebarNavItem
              icon='sign-out'
              text={`${messages.authentication.logOut} — ${sprintf(
                messages.authentication.username,
                username
              )}`}
              href='/logout'
            />}
          <SidebarNavItem
            icon='question-circle'
            text='Help and Documentation'
            href='http://docs.analysis.conveyal.com/'
          />

          {error &&
            <SidebarNavItem danger icon='exclamation-circle' text={error} />}

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

class SidebarNavItem extends PureComponent {
  state = {
    hovering: false
  }

  _mouseOver = () =>
    this.setState({hovering: true})

  _mouseOut = () =>
    this.setState({hovering: false})

  render () {
    const {active, icon, href, text, ...props} = this.props
    const {hovering} = this.state
    const className = classnames('Sidebar-navItem', {active, ...props})
    const isAbsoluteUrl = href && href.startsWith('http')
    return (
      <div
        className={className}
        onBlur={this._mouseOut}
        onFocus={this._mouseOver}
        onMouseOut={this._mouseOut}
        onMouseOver={this._mouseOver}
        >
        {!active && hovering &&
          <div className='tooltip right'>
            <div className='tooltip-arrow' />
            <div className='tooltip-inner'>{text}</div>
          </div>}
        {href &&
          !isAbsoluteUrl &&
          <Link to={href}>
            <ItemContents icon={icon} text={text} />
          </Link>}
        {href &&
          isAbsoluteUrl &&
          <a href={href} target='_blank'>
            <ItemContents icon={icon} text={text} />
          </a>}
        {!href &&
          <span>
            <ItemContents icon={icon} text={text} />
          </span>}
      </div>
    )
  }
}

const ItemContents = ({icon, text}) =>
  <span>
    <Icon type={icon} />
    <span className='Sidebar-navItem-text'>
      {' '}{text}
    </span>
  </span>
