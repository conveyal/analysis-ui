import get from 'lodash/get'
export default function currentProjectId(state, ownProps = {}) {
  return (
    ownProps.projectId ||
    state.queryString.projectId ||
    get(state, 'analysis.requestsSettings[0].projectId')
  )
}
