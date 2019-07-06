import React from 'react'

import useRouteChanging from 'lib/hooks/use-route-changing'

export default function Dock(p) {
  const [routeChanging] = useRouteChanging()
  let className = 'ApplicationDock'
  if (routeChanging) className += ' disableAndDim'

  return <div className={className}>{p.children}</div>
}
