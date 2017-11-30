// @flow
import selectActiveModification from '../active-modification'
const {describe, expect, it} = global
describe('selectors > active modification', () => {
  it('should select an active modification', () => {
    const modification = {
      _id: '1'
    }
    expect(selectActiveModification({
      project: {
        activeModificationId: modification._id,
        modifications: [modification]
      }
    })).toBe(modification)
  })
})
