import {createSelector} from 'reselect'

export default createSelector(
  (state, props) => props.modification,
  (modification = {}) => modification.segments || []
)
