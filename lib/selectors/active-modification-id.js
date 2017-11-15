// @flow
import {createSelector} from 'reselect'

export default createSelector(
  (state = {}) => state.project && state.project.activeModificationId,
  (_, ownProps) => ownProps,
  (activeModificationId, ownProps = {}) =>
    activeModificationId ||
    ownProps.modificationId ||
    (ownProps.modification && ownProps.modification._id)
)
