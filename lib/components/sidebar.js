import {
  faChartArea,
  faCubes,
  faDatabase,
  faExclamationCircle,
  faGlobe,
  faMap,
  faPencilAlt,
  faQuestionCircle,
  faServer,
  faSignOutAlt,
  faSpinner,
  faTh,
  faWifi
} from '@fortawesome/free-solid-svg-icons'
import classnames from 'classnames'
import get from 'lodash/get'
import Link from 'next/link'
import {withRouter} from 'next/router'
import React from 'react'
import {connect} from 'react-redux'

import {PATHS} from '../constants'
import {CREATING_ID} from '../constants/region'
import message from '../message'
import selectOutstandingRequests from '../selectors/outstanding-requests'

import Icon from './icon'
import Tip from './tip'

const isServer = typeof window === 'undefined'

const fn = () => {}
const addListener = isServer ? fn : window.addEventListener
const removeListener = isServer ? fn : window.removeEventListener
const isOnline = () => (isServer ? true : navigator.onLine)

function mapStateToProps(state, ownProps) {
  return {
    outstandingRequests: selectOutstandingRequests(state, ownProps),
    username: get(state, 'user.name')
  }
}

class Sidebar extends React.Component {
  state = {
    error: null,
    online: isOnline()
  }

  componentDidMount() {
    // TODO: Check to see if it can communicate with the backend, not just the internet (for local development)
    addListener('online', this._onOnline)
    addListener('offline', this._onOffline)
    addListener('beforeunload', this._onBeforeUnload)
    addListener('error', this._onError)
    addListener('unhandledrejection', this._onUnhandledRejection)
  }

  componentWillUnmount() {
    removeListener('online', this._onOnline)
    removeListener('offline', this._onOffline)
    removeListener('beforeunload', this._onBeforeUnload)
    removeListener('error', this._onError)
    removeListener('unhandledrejection', this._onUnhandledRejection)
  }

  _onBeforeUnload = e => {
    if (this.props.outstandingRequests > 0) {
      const returnValue = (e.returnValue = message('nav.unfinishedRequests'))
      return returnValue
    }
  }

  _onError = error => this.setState(() => ({error: error.message}))
  _onOnline = () => this.setState(() => ({online: true}))
  _onOffline = () => this.setState(() => ({online: false}))
  _onUnhandledRejection = error =>
    this.setState(() => ({error: error.reason.stack}))

  render() {
    const p = this.props
    const pathname = p.router.pathname
    const {projectId, regionId} = p.router.query
    const {error, online} = this.state
    return (
      <div className='Sidebar'>
        {p.outstandingRequests > 0 ? (
          <div className='Sidebar-spinner'>
            <Icon icon={faSpinner} spin />
          </div>
        ) : (
          <div className='Sidebar-logo' />
        )}

        <ItemLink
          icon={faGlobe}
          text={message('nav.regions')}
          href={PATHS.regions}
        />
        {regionId && regionId !== CREATING_ID && (
          <div>
            <ItemLink
              active={PATHS.regionSettings === pathname}
              icon={faMap}
              text={message('nav.regionSettings')}
              href={{
                pathname: PATHS.regionSettings,
                query: {regionId}
              }}
            />
            <ItemLink
              active={PATHS.projects === pathname}
              icon={faCubes}
              text={message('nav.projects')}
              href={{
                pathname: PATHS.projects,
                query: {regionId}
              }}
            />
            <ItemLink
              active={pathname.startsWith('/bundle')}
              icon={faDatabase}
              text={message('nav.gtfsBundles')}
              href={{
                pathname: PATHS.bundles,
                query: {regionId}
              }}
            />
            <ItemLink
              active={pathname.startsWith('/opportunities')}
              icon={faTh}
              text={message('nav.opportunityDatasets')}
              href={{
                pathname: PATHS.opportunities,
                query: {regionId}
              }}
            />
            {projectId ? (
              <ItemLink
                active={pathname.startsWith('/modification')}
                icon={faPencilAlt}
                text={message('nav.editModifications')}
                href={{
                  pathname: PATHS.modifications,
                  query: {regionId, projectId}
                }}
              />
            ) : (
              <ItemLink
                icon={faPencilAlt}
                text={message('nav.editModifications')}
                href={{
                  // TODO: use `next/Link as: to set Sidebar active
                  pathname: PATHS.projects,
                  query: {regionId}
                }}
              />
            )}
            <ItemLink
              active={pathname.startsWith('/analysis')}
              icon={faChartArea}
              text={message('nav.analyze')}
              href={{
                pathname: PATHS.analysis,
                query: {projectId, regionId}
              }}
            />
            <ItemLink
              active={pathname.startsWith(PATHS.regionalAnalysis)}
              icon={faServer}
              text='Regional Analysis'
              href={{
                pathname: PATHS.regionalAnalysis,
                query: {regionId}
              }}
            />
          </div>
        )}

        <div className='Sidebar-bottom'>
          {p.username && (
            <ItemLink
              icon={faSignOutAlt}
              text={
                message('authentication.logOut') +
                ' - ' +
                message('authentication.username', {username: p.username})
              }
              href={PATHS.logout}
            />
          )}
          <ExternalLink
            icon={faQuestionCircle}
            text={message('nav.help')}
            href='http://docs.analysis.conveyal.com/'
          />

          {error && (
            <Tip
              className='Sidebar-navItem danger'
              text={message('error.script') + error}
            >
              <span className='Sidebar-navItem-contents'>
                <Icon icon={faExclamationCircle} />
              </span>
            </Tip>
          )}

          {!online && (
            <Tip
              className='Sidebar-navItem danger'
              text={message('nav.notConnectedToInternet')}
            >
              <span className='Sidebar-navItem-contents'>
                <Icon icon={faWifi} />
              </span>
            </Tip>
          )}
        </div>
      </div>
    )
  }
}

const ItemLink = p => {
  const className = classnames('Sidebar-navItem', {active: p.active})
  return (
    <Tip className={className} tip={p.text}>
      <Link href={p.href}>
        <a className='Sidebar-navItem-contents'>
          <Icon icon={p.icon} />
        </a>
      </Link>
    </Tip>
  )
}
const ExternalLink = p => (
  <Tip className='Sidebar-navItem' tip={p.text}>
    <a
      className='Sidebar-navItem-contents'
      target='_blank'
      href={p.href}
      rel='noopener noreferrer'
    >
      <Icon icon={p.icon} />
    </a>
  </Tip>
)

export default connect(mapStateToProps)(withRouter(Sidebar))
