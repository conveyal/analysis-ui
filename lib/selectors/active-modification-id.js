export default function activeModificationId(state, ownProps = {}) {
  return ownProps.modificationId || state.queryString.modificationId
}
