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
    // select the scratch bundle
    cy.findByLabelText(/Associated network bundle/i).type(
      '{enter}scratch bundle{enter}'
    )
    cy.get('a.btn')
      .contains(/Create/)
      .should('not.be.disabled')
      .click()
    cy.location('pathname').should('match', /regions\/.{24}\/projects\/.{24}/)
    cy.contains(/Modifications/)
    // make sure it's listed among the projects
    cy.findByTitle('Projects').click({force: true})
    cy.contains(projectName).click()
    cy.get('svg[data-icon="cog"]').click()
    cy.findByLabelText(/Project name/)
      .invoke('val')
      .then((val) => expect(val).to.eq(projectName))
    // check that the bundle is associated and can't now be deleted
    cy.findByRole('link', {name: /view bundle info/i}).click()
    cy.contains(/Create a new network bundle/)
    //cy.findByLabelText(/Network bundle name/i).invoke('val').then(
    //  val => expect(val).to.eq('scratch bundle')
    //)
    cy.findByText(/Delete this network bundle/i).should('not.exist')
    // delete the project
    cy.findByTitle('Projects').click({force: true})
    cy.contains(projectName).click()
    cy.get('svg[data-icon="cog"]').click()
    cy.findByText(/Delete project/i).click()
    cy.location('pathname').should('match', /regions\/.{24}$/)
    cy.findByText(projectName).should('not.exist')
  })
})
