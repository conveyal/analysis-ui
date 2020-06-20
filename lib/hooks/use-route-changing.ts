import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'

export default function useRouteChanging(): [boolean, string] {
  const router = useRouter()
  const [pathname, setPathname] = useState(router.pathname)
  const [routeChanging, setRouteChanging] = useState(false)

  // Handle router events
  useEffect(() => {
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
