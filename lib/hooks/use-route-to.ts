import isEqual from 'lodash/isEqual'
import {useRouter} from 'next/router'
import {useCallback, useEffect, useState} from 'react'

import {routeTo} from '../router'

export default function useRouteTo(to: string, props: any = {}) {
  const router = useRouter()
  const [result, setResult] = useState(() => routeTo(to, props))

  useEffect(() => {
    const newRouteTo = routeTo(to, props)
    if (!isEqual(newRouteTo, result)) {
      setResult(newRouteTo)

      // Prefetch in production
      router.prefetch(newRouteTo.href, newRouteTo.as)
    }
  }, [props, result, router, setResult, to])

  const onClick = useCallback(
    (newProps?: any) => {
      if (newProps && !newProps.nativeEvent) {
        const newRoute = routeTo(to, newProps)
        router.push(
          {pathname: newRoute.href, query: newRoute.query},
          newRoute.as
        )
      } else {
        router.push({pathname: result.href, query: result.query}, result.as)
      }
    },
    [result, router, to]
  )

  return onClick
}
