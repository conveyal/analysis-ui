import {load} from 'lib/actions/region'
import SinglePointAnalysis from 'lib/containers/single-point-analysis'
import withFetch from 'lib/with-fetch'

function fetchData(dispatch, query) {
  return dispatch(load(query.regionId))
}

export default withFetch(SinglePointAnalysis, fetchData)
