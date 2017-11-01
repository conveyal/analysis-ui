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
  (_, ownProps = {}) => ownProps.params,
  () => window.location.pathname,
  (params = {}, path) => params.modificationId || getModificationIdFromPath(path)
)
