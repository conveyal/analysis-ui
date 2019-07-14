import get from 'lodash/get'

export default function(state, ownProps) {
  return get(ownProps, 'analysisId') || get(state, 'queryString.analysisId')
}
