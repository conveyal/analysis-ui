import get from 'lodash/get'
import {createSelector} from 'reselect'

import selectActiveModification from './active-modification'

export default createSelector(
  selectActiveModification,
  state => state.project && state.project.currentProject,
  (_, ownProps = {}) =>
    get(ownProps, 'query.projectId') || get(ownProps, 'router.query.projectId'),
  (activeModification = {}, currentProject = {}, projectId) =>
    projectId || activeModification.projectId || currentProject._id
)
