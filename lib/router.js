import {RouteTo} from 'lib/constants'

export function routeTo(to, props) {
  const href = RouteTo[to]
  if (!href) console.error(`${to} is not a valid RouteTo route!`)
  const as = hrefToAs(href, props)
  return {as, href}
}

export function hrefToAs(str, obj) {
  if (!obj) return str
  const qs = []
  Object.keys(obj).forEach(k => {
    const key = `[${k}]`
    if (str.includes(key)) {
      str = str.replace(`[${k}]`, obj[k])
    } else {
      qs.push(`${k}=${obj[k]}`)
    }
  })
  return qs.length > 0 ? `${str}?${qs.join('&')}` : str
}
