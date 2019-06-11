import {useRouter} from 'next/router'
import React from 'react'

export default function useRouteChanging() {
  const router = useRouter()
  const [pathname, setPathname] = React.useState(router.pathname)
  const [routeChanging, setRouteChanging] = React.useState(false)

  // Handle router events
  React.useEffect(() => {
    function onRouteChangeStart(url) {
      setPathname(url)
      setRouteChanging(true)
    }

    function onRouteChangeComplete() {
      setRouteChanging(false)
    }

    router.events.on('routeChangeStart', onRouteChangeStart)
    router.events.on('routeChangeComplete', onRouteChangeComplete)

    return () => {
      router.events.off('routeChangeStart', onRouteChangeStart)
      router.events.off('routeChangeComplete', onRouteChangeComplete)
    }
  }, [router])

  return [routeChanging, pathname]
}
