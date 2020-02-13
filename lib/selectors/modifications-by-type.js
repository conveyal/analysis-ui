//
import {createSelector} from 'reselect'

import selectModifications from './modifications'

export default createSelector(selectModifications, organizeByType)

function organizeByType(modifications = []) {
  return modifications.reduce((modifications, modification) => {
    const {type} = modification
    if (!modifications[type]) modifications[type] = []
    modifications[type].push(modification)
    return modifications
  }, {})
}
