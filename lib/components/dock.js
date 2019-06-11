import React from 'react'

import useRouteChanging from 'lib/hooks/use-route-changing'

export default function Dock({children, ...p}) {
  const [routeChanging] = useRouteChanging()
  let className = 'ApplicationDock'
  if (routeChanging) className += ' disableAndDim'
  if (p.className) className += ' ' + p.className

  return <div className={className}>{children}</div>
}
