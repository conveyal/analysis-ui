// @flow
import get from 'lodash/get'
export default function (state: any) {
  return get(state, 'region.bundles', [])
}
