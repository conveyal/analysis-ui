import {load} from 'lib/actions/region'
import SelectProject from 'lib/components/select-project'
import withFetch from 'lib/with-fetch'

export function fetchData(dispatch, query) {
  return dispatch(load(query.regionId))
}

export default withFetch(SelectProject, fetchData)
