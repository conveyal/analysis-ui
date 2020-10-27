import {createModificationName} from '../utils'

/**
 * Modifications that allow drawing should handle drawing over the anti-meridian
 * without failing.
 *
 * Reported here: https://github.com/conveyal/analysis-ui/issues/1315
 */
describe('Modification drawing over anti-meridian', () => {
  before(() => {
    cy.setup('project')
  })

  beforeEach(() => {
    cy.goToEntity('project')
  })

  it('should handle Add Trip Patterns', () => {
    const name = createModificationName('Add Trip Pattern', 'anti-meridian')
    cy.createModification('Add Trip Pattern', name)

    cy.deleteThisModification()
  })

  it('should handle Add Streets', () => {
    const name = createModificationName('Add Trip Pattern', 'anti-meridian')
    cy.createModification('Add Trip Pattern', name)

    cy.deleteThisModification()
  })
})
