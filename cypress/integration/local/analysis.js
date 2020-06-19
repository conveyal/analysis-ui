context('Single point analysis', () => {
  before(() => {
    cy.setup('project')
    cy.setup('opportunities')
    cy.navTo('Analyze')
    cy.get('div.leaflet-container').as('map')
  })

  it('has all form elements', function () {
    // select project and scenario
    cy.findAllByLabelText(/^Project$/)
      .first()
      .click({force: true})
      .type('scratch{enter}')
    cy.contains('scratch project')
    cy.findAllByLabelText(/^Scenario$/)
      .first()
      .click({force: true})
      .type('baseline{enter}')
    cy.contains('Baseline')
    //cy.findByLabelText(/Bookmark/)
    cy.findByLabelText(/^Opportunity Dataset$/)
      .click({force: true})
      .type('default{enter}')
    //cy.findByText(/Access mode/i)
    //  .findByTitle('Bike')
    cy.findByLabelText(/Walk speed/i)
    cy.findByLabelText(/Max walk time/i)
    cy.findByLabelText(/From time/i)
    cy.findByLabelText(/To time/i)
    //cy.findByLabelText(/Date/i)
    // start analysis from default marker position
    cy.findByText(/Fetch Results/i).click()
    cy.findByText(/Analyze results/i, {timeout: 200000}).should('exist')
    // move the marker and re-run
    cy.mapMoveMarkerTo([39.08877, -84.5106]) // to transit center
    cy.findByText(/Fetch Results/i).click()
    //cy.get('@map').matchImageSnapshot('post')
  })
})
