export default function currentRegionId(state, ownProps = {}) {
  return ownProps.regionId || state.queryString.regionId
}
