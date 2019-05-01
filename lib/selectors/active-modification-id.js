import get from 'lodash/get'
import {createSelector} from 'reselect'

export default createSelector(
  (state = {}) => state.project,
  (_, ownProps) => ownProps,
  (project, ownProps) =>
    get(ownProps, 'query.modificationId', project.activeModificationId)
)
