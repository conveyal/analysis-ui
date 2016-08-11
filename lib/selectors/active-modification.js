import {createSelector} from 'reselect'

export default createSelector(
  (state) => state.scenario.modificationsById,
  (state, props) => props.params.modificationId,
  (modificationsById, modificationId) => (modificationsById || {})[modificationId]
)
