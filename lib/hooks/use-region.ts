import useSWR, {ConfigInterface} from 'swr'
import {useContext} from 'react'

import {UserContext} from '../user'

export default function useRegions(_id: string, config?: ConfigInterface) {
  const user = useContext(UserContext)
  const results = useSWR([`/api/regions/${_id}`, user], config)

  return {...results, region: results.data}
}
