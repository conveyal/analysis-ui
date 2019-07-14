import selectActiveModification from '../active-modification'

test('should select an active modification', () => {
  const modification = {
    _id: '1'
  }
  expect(
    selectActiveModification({
      project: {
        modifications: [modification]
      },
      queryString: {
        modificationId: modification._id
      }
    })
  ).toBe(modification)
})
