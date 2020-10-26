import {createModificationName} from '../utils'

/**
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
  })
})
