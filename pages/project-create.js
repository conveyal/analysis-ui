import {loadBundles} from 'lib/actions'
import CreateProject from 'lib/components/create-project'
import withFetch from 'lib/with-fetch'

async function fetchData(dispatch, query) {
  const bundles = await dispatch(loadBundles({regionId: query.regionId}))
  return {bundles}
}

export default withFetch(CreateProject, fetchData)
