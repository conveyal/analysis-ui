export default function currentProjectId(state, ownProps = {}) {
  return ownProps.projectId || state.queryString.projectId
}
