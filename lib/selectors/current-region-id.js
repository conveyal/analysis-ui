import get from 'lodash/get'

export default function currentRegionId(state, ownProps) {
  return get(ownProps, 'regionId', get(state, 'queryString.regionId'))
}
