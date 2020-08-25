import useSWR, {ConfigInterface} from 'swr'
import {useContext} from 'react'

import {UserContext} from '../user'

export default function useRegions(config: ConfigInterface) {
  const user = useContext(UserContext)
  const results = useSWR(['/api/regions', user], config)

  return {...results, regions: results.data}
}
