import {createSelector} from 'reselect'

export default createSelector(
  (state) => state.scenario.modifications,
  (modifications) => modifications.map((modification) => modification.id)
)
