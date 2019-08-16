import {
  faChartArea,
  faCompass,
  faCubes,
  faDatabase,
  faExclamationCircle,
  faGlobe,
  faLayerGroup,
  faMap,
  faPencilAlt,
  faQuestionCircle,
  faServer,
  faSignOutAlt,
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

export default function Sidebar() {
  const router = useRouter()
  const [routeChanging, pathname] = useRouteChanging()
  const username = useSelector(s => get(s, 'user.email'))
  const {projectId, regionId} = router.query

  /**
   * Render an ItemLink. Created internally to capture the pathname so it
   * doesn't need to be passed to each individually.
   */
  const ItemLink = React.useMemo(() => {
    function isActive({to, ...p}) {
      let {href, as} = routeTo(to, p)
      href = href.split('?')[0]
      as = as.split('?')[0]
      const pathOnly = pathname.split('?')[0]
      // Server === 'href', client === 'as'
      return pathOnly === href || pathOnly === as
    }

    return React.memo(function ItemLink(p) {
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
    })
  }, [pathname])

  return (
    <div
      className='Sidebar'
      style={{pointerEvents: routeChanging ? 'none' : 'auto'}}
    >
      <LogoSpinner routeChanging={routeChanging} />

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
            icon={faLayerGroup}
            text='Resources'
            link={{
              to: 'resources',
              regionId
            }}
          />
          <ItemLink
            icon={faPencilAlt}
            text={message('nav.editModifications')}
            link={{
              to: 'modifications',
              regionId,
              projectId: projectId ? projectId : 'undefined'
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

        <ErrorTip />
        <OnlineIndicator />
      </div>
    </div>
  )
}

const isServer = typeof window === 'undefined'
const fn = () => {}
const addListener = isServer ? fn : window.addEventListener
const removeListener = isServer ? fn : window.removeEventListener

function LogoSpinner(p) {
  const outstandingRequests = useSelector(selectOutstandingRequests)

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

  if (outstandingRequests === 0 || !p.routeChanging) {
    return <div className='Sidebar-logo' />
  }

  return (
    <div className='Sidebar-spinner'>
      <Icon icon={faCompass} spin />
    </div>
  )
}

const isOnline = () => (isServer ? true : navigator.onLine)
function OnlineIndicator() {
  const [online, setOnline] = React.useState(isOnline())

  React.useEffect(() => {
    const onOnline = () => setOnline(true)
    const onOffline = () => setOnline(false)
    // TODO: Check to see if it can communicate with the backend, not just the
    // internet (for local development)
    addListener('online', onOnline)
    addListener('offline', onOffline)
    return () => {
      removeListener('online', onOnline)
      removeListener('offline', onOffline)
    }
  }, [setOnline])

  if (online) return null
  return (
    <Tip
      className='Sidebar-navItem danger'
      tip={message('nav.notConnectedToInternet')}
    >
      <span className='Sidebar-navItem-contents'>
        <Icon icon={faWifi} />
      </span>
    </Tip>
  )
}

function ErrorTip() {
  const [error, setError] = React.useState()
  // Handle error events
  React.useEffect(() => {
    const onError = e => setError(e.message)
    const onUnhandledRejection = e => setError(e.reason.stack)

    addListener('error', onError)
    addListener('unhandledrejection', onUnhandledRejection)

    return () => {
      removeListener('error', onError)
      removeListener('unhandledrejection', onUnhandledRejection)
    }
  }, [setError])

  if (!error) return null
  return (
    <Tip
      className='Sidebar-navItem danger'
      tip={message('error.script') + error}
    >
      <span className='Sidebar-navItem-contents'>
        <Icon icon={faExclamationCircle} />
      </span>
    </Tip>
  )
}

function ExternalLink(p) {
  return (
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
}
