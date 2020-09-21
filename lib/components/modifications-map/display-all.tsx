import get from 'lodash/get'
import dynamic from 'next/dynamic'
import {useRouter} from 'next/router'
import React from 'react'
import {useSelector} from 'react-redux'

import {LS_MOM} from 'lib/constants'
import selectFeedsById from 'lib/selectors/feeds-by-id'
import selectModifications from 'lib/selectors/modifications'
import {getParsedItem} from 'lib/utils/local-storage'

const Display = dynamic(() => import('./display'), {ssr: false})

export function DisplayAll({feedsById, isEditing = false, modifications}) {
  return modifications.map((m) => (
    <Display
      dim={isEditing}
      feed={feedsById[m.feed]}
      key={m._id}
      modification={m}
    />
  ))
}

export default function ConnectedDisplayAll(p) {
  const router = useRouter()
  const feedsById = useSelector(selectFeedsById)
  const modifications = useSelector(selectModifications)
  const modificationId = router.query.modificationId

  const modificationsOnMap = get(
    getParsedItem(LS_MOM),
    router.query.projectId,
    []
  )

  return (
    <DisplayAll
      feedsById={feedsById}
      isEditing={p.isEditing}
      modifications={modifications.filter(
        (m) => m._id !== modificationId && modificationsOnMap.includes(m._id)
      )}
    />
  )
}
