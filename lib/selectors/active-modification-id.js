// @flow
import {createSelector} from 'reselect'

export default createSelector(
  (state = {}) => state.scenario && state.scenario.activeModificationId,
  (_, ownProps) => ownProps,
  (activeModificationId, ownProps = {}) =>
    activeModificationId ||
    ownProps.modificationId ||
    (ownProps.modification && ownProps.modification._id)
)
