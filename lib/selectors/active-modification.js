// @flow
import {createSelector} from 'reselect'

function getModificationIdFromPath (path) {
  const index = path.indexOf('modifications/')
  if (index > -1) {
    return path
      .slice(index)
      .split('/')[1] // remove any other parameters
      .split('?')[0] // remove query parameters
  }
}

export default createSelector(
  [
    state => state.scenario.modificationsById,
    (state, props) => {
      if (props.modification) {
        return props.modification.id
      } else if (props.params) {
        return props.params.modificationId
      } else {
        return getModificationIdFromPath(window.location.pathname)
      }
    }
  ],
  (modificationsById, modificationId) =>
    (modificationsById || {})[modificationId]
)
