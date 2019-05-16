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
import {useSelector} from 'react-redux'

import {RouteTo} from '../constants'
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

function Sidebar(p) {
  const [error, setError] = React.useState()
  const [online, setOnline] = React.useState(isOnline())
  const outstandingRequests = useSelector(selectOutstandingRequests)
  const username = useSelector(s => get(s, 'user.email'))

  React.useEffect(() => {
    if (outstandingRequests > 0) {
      const onBeforeUnload = e => {
        const returnValue = (e.returnValue = message('nav.unfinishedRequests'))
        return returnValue
      }

      addListener('beforeunload', onBeforeUnload)

      return () => removeListener('beforeunload', onBeforeUnload)
    }
  }, [outstandingRequests])

  React.useEffect(() => {
    const onOnline = () => setOnline(true)
    const onOffline = () => setOnline(false)
    const onError = e => setError(e.message)
    const onUnhandledRejection = e => setError(e.reason.stack)

    // TODO: Check to see if it can communicate with the backend, not just the internet (for local development)
    addListener('online', onOnline)
    addListener('offline', onOffline)
    addListener('error', onError)
    addListener('unhandledrejection', onUnhandledRejection)

    return () => {
      removeListener('online', onOnline)
      removeListener('offline', onOffline)
      removeListener('error', onError)
      removeListener('unhandledrejection', onUnhandledRejection)
    }
  }, [setError, setOnline])

  const pathname = p.router.pathname
  const {projectId, regionId} = p.router.query
  return (
    <div className='Sidebar'>
      {outstandingRequests > 0 ? (
        <div className='Sidebar-spinner'>
          <Icon icon={faSpinner} spin />
        </div>
      ) : (
        <div className='Sidebar-logo' />
      )}

      <ItemLink
        icon={faGlobe}
        text={message('nav.regions')}
        href={RouteTo.regions}
      />
      {regionId && regionId !== CREATING_ID && (
        <div>
          <ItemLink
            active={RouteTo.regionSettings === pathname}
            icon={faMap}
            text={message('nav.regionSettings')}
            href={{
              pathname: RouteTo.regionSettings,
              query: {regionId}
            }}
          />
          <ItemLink
            active={RouteTo.projects === pathname}
            icon={faCubes}
            text={message('nav.projects')}
            href={{
              pathname: RouteTo.projects,
              query: {regionId}
            }}
          />
          <ItemLink
            active={pathname.startsWith('/bundle')}
            icon={faDatabase}
            text={message('nav.gtfsBundles')}
            href={{
              pathname: RouteTo.bundles,
              query: {regionId}
            }}
          />
          <ItemLink
            active={pathname.startsWith('/opportunities')}
            icon={faTh}
            text={message('nav.opportunityDatasets')}
            href={{
              pathname: RouteTo.opportunities,
              query: {regionId}
            }}
          />
          {projectId ? (
            <ItemLink
              active={pathname.startsWith('/modification')}
              icon={faPencilAlt}
              text={message('nav.editModifications')}
              href={{
                pathname: RouteTo.modifications,
                query: {regionId, projectId}
              }}
            />
          ) : (
            <ItemLink
              icon={faPencilAlt}
              text={message('nav.editModifications')}
              href={{
                // TODO: use `next/Link as: to set Sidebar active
                pathname: RouteTo.projects,
                query: {regionId}
              }}
            />
          )}
          <ItemLink
            active={pathname.startsWith('/analysis')}
            icon={faChartArea}
            text={message('nav.analyze')}
            href={{
              pathname: RouteTo.analysis,
              query: {projectId, regionId}
            }}
          />
          <ItemLink
            active={pathname.startsWith(RouteTo.regionalAnalyses)}
            icon={faServer}
            text='Regional Analyses'
            href={{
              pathname: RouteTo.regionalAnalyses,
              query: {regionId}
            }}
          />
        </div>
      )}

      <div className='Sidebar-bottom'>
        {username && (
          <ItemLink
            icon={faSignOutAlt}
            text={
              message('authentication.logOut') +
              ' - ' +
              message('authentication.username', {username: username})
            }
            href={RouteTo.logout}
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

const ItemLink = p => {
  const className = classnames('Sidebar-navItem', {active: p.active})
  return (
    <Tip className={className} tip={p.text}>
      <Link href={p.href} prefetch>
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

export default withRouter(Sidebar)
