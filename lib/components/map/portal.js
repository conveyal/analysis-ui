import {createPortal} from 'react-dom'

import usePortal from 'lib/hooks/use-portal'

export default function Portal(p) {
  const target = usePortal('MapPortal')
  return createPortal(p.children, target)
}
