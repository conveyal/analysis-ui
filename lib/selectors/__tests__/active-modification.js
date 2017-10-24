// @flow
import selectActiveModification from '../active-modification'
const {describe, expect, it} = global
describe('selectors > active modification', () => {
  it('should select an active modification', () => {
    const modification = {
      id: '1'
    }
    expect(selectActiveModification({
      scenario: {
        modifications: [modification]
      }
    }, {
      params: {
        modificationId: '1'
      }
    })).toBe(modification)
  })
})
