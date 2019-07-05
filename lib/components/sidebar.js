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
import {useRouter} from 'next/router'
import React from 'react'
import {useSelector} from 'react-redux'

import useRouteChanging from 'lib/hooks/use-route-changing'
import {routeTo} from 'lib/router'

import {CREATING_ID} from '../constants/region'
import message from '../message'
import selectOutstandingRequests from '../selectors/outstanding-requests'

import Icon from './icon'
import Link from './link'
import Tip from './tip'

const isServer = typeof window === 'undefined'

const fn = () => {}
const addListener = isServer ? fn : window.addEventListener
const removeListener = isServer ? fn : window.removeEventListener
const isOnline = () => (isServer ? true : navigator.onLine)

export default function Sidebar() {
  const router = useRouter()
  const [error, setError] = React.useState()
  const [online, setOnline] = React.useState(isOnline())
  const [routeChanging, pathname] = useRouteChanging()
  const outstandingRequests = useSelector(selectOutstandingRequests)
  const username = useSelector(s => get(s, 'user.email'))
  const {projectId, regionId} = router.query

  // Handle outstanding requests
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

  // Handle window events
  React.useEffect(() => {
    const onOnline = () => setOnline(true)
    const onOffline = () => setOnline(false)
    const onError = e => setError(e.message)
    const onUnhandledRejection = e => setError(e.reason.stack)

    // TODO: Check to see if it can communicate with the backend, not just the
    // internet (for local development)
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

  /**
   * Render an ItemLink. Created internally to capture the pathname so it
   * doesn't need to be passed to each individually.
   */
  const ItemLink = React.useMemo(() => {
    function isActive({to, ...p}) {
      const {href, as} = routeTo(to, p)
      // Server === 'href', client === 'as'
      return pathname === href || pathname === as
    }

    return function ItemLink(p) {
      const className = classnames('Sidebar-navItem', {
        active: isActive(p.link)
      })

      return (
        <Tip className={className} tip={p.text}>
          <Link {...p.link}>
            <a className='Sidebar-navItem-contents'>
              <Icon icon={p.icon} />
            </a>
          </Link>
        </Tip>
      )
    }
  }, [pathname])

  return (
    <div
      className='Sidebar'
      style={{pointerEvents: routeChanging ? 'none' : 'auto'}}
    >
      {outstandingRequests > 0 || routeChanging ? (
        <div className='Sidebar-spinner'>
          <Icon icon={faSpinner} spin />
        </div>
      ) : (
        <div className='Sidebar-logo' />
      )}

      <ItemLink
        icon={faGlobe}
        text={message('nav.regions')}
        link={{to: 'regions'}}
      />
      {regionId && regionId !== CREATING_ID && (
        <>
          <ItemLink
            icon={faMap}
            text={message('nav.regionSettings')}
            link={{
              to: 'regionSettings',
              regionId
            }}
          />
          <ItemLink
            icon={faCubes}
            text={message('nav.projects')}
            link={{
              to: 'projects',
              regionId
            }}
          />
          <ItemLink
            icon={faDatabase}
            text={message('nav.gtfsBundles')}
            link={{
              to: 'bundles',
              regionId
            }}
          />
          <ItemLink
            icon={faTh}
            text={message('nav.opportunityDatasets')}
            link={{
              to: 'opportunities',
              regionId
            }}
          />
          <ItemLink
            icon={faPencilAlt}
            text={message('nav.editModifications')}
            link={{
              to: 'modifications',
              regionId,
              projectId
            }}
          />
          <ItemLink
            icon={faChartArea}
            text={message('nav.analyze')}
            link={{
              to: 'analysis',
              projectId,
              regionId
            }}
          />
          <ItemLink
            icon={faServer}
            text='Regional Analyses'
            to='regionalAnalyses'
            link={{
              to: 'regionalAnalyses',
              regionId
            }}
          />
        </>
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
            link={{to: 'logout'}}
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
            tip={message('error.script') + error}
          >
            <span className='Sidebar-navItem-contents'>
              <Icon icon={faExclamationCircle} />
            </span>
          </Tip>
        )}

        {!online && (
          <Tip
            className='Sidebar-navItem danger'
            tip={message('nav.notConnectedToInternet')}
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
