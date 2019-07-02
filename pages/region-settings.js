import {loadRegion} from 'lib/actions/region'
import EditRegion from 'lib/components/edit-region'
import withFetch from 'lib/with-fetch'

async function fetchData(dispatch, query) {
  const region = await dispatch(loadRegion(query.regionId))
  return {region}
}

export default withFetch(EditRegion, fetchData)
