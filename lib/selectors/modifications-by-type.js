// @flow
import {createSelector} from 'reselect'

export default createSelector(
  (state) => state.scenario.modifications,
  organizeByType
)

function organizeByType (modifications = []) {
  return modifications.reduce((modifications, modification) => {
    const {type} = modification
    if (!modifications[type]) modifications[type] = []
    modifications[type].push(modification)
    return modifications
  }, {})
}
