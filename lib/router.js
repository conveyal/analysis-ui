import {RouteTo} from 'lib/constants'

export function routeTo(to, props) {
  const href = RouteTo[to]
  const as = hrefToAs(href, props)
  return {as, href}
}

export function hrefToAs(str, obj) {
  if (!obj) return str
  Object.keys(obj).forEach(k => {
    str = str.replace(`[${k}]`, obj[k])
  })
  return str
}
