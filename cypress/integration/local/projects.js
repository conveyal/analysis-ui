context('Projects', () => {
  before('prepare the region and bundle', () => {
    cy.fixture('regions/scratch.json').as('region')
    cy.setupBundle('scratch')
  })

  it('can be created and deleted', function () {
    let projectName = 'project ' + Date.now()
    cy.findByTitle('Projects').click({force: true})
    cy.findByText(/Create new Project/i).click()
    cy.location('pathname').should('match', /create-project/)
    cy.findByLabelText(/Project name/).type(projectName)
    // hack to select first GTFS from dropdown
    cy.findByLabelText(/Associated network bundle/i).type(
      '{enter}scratch{enter}'
    )
    cy.get('a.btn')
      .contains(/Create/)
      .click()
    cy.location('pathname').should('match', /regions\/.{24}\/projects\/.{24}/)
    cy.contains(/Modifications/)
    // make sure it's listed among the projects
    cy.findByTitle('Projects').click({force: true})
    cy.contains(projectName).click()
    cy.get('svg[data-icon="cog"]').click()
    cy.findByText(/Delete project/i).click()
    cy.location('pathname').should('match', /regions\/.{24}$/)
    cy.findByText(projectName).should('not.exist')
  })
})
