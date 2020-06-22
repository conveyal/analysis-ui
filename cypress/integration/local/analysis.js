context('Single point analysis', () => {
  before(() => {
    cy.setup('project')
    cy.setup('opportunities')
    cy.navTo('Analyze')
    cy.get('div.leaflet-container').as('map')
  })

  it('has all form elements', function () {
    //cy.findByLabelText(/Time cutoff/i) // TODO needs label
    cy.findByLabelText(/Travel time percentile/i) // note: hidden input
    cy.findAllByRole('button', {name: 'Multi-point'})
      .first()
      .as('multi-point-main')
      .should('be.disabled')
    // select project and scenario
    // TODO distinguish main and comparison projects
    cy.findAllByLabelText(/^Project$/)
      .first()
      .click({force: true})
      .type('scratch{enter}')
    cy.contains('scratch project')
    // TODO distinguish main and comparison scenarios
    cy.findAllByLabelText(/^Scenario$/)
      .first()
      .click({force: true})
      .type('baseline{enter}')
    cy.contains('Baseline')
    cy.findByLabelText(/^Opportunity Dataset$/)
      .click({force: true})
      .type('default{enter}')
    cy.findAllByLabelText(/Bookmark/).first()
    //cy.findByLabelText(/Access mode/i) // TODO dissociated label
    //cy.findByLabelText(/Transit modes/i) // TODO dissociated label
    //cy.findByLabelText(/Egress mode/i) // TODO dissociated label
    cy.findByLabelText(/Walk speed/i)
    cy.findByLabelText(/Max walk time/i)
    //cy.findByLabelText(/Date/i) // TODO dissociated label
    cy.findByLabelText(/From time/i)
    cy.findByLabelText(/To time/i)
    //cy.findByLabelText(/Simulated Schedules/i) // TODO dissociated label
    //cy.findByLabelText(/Maximum transfers/i) // TODO dissociated label
    cy.findByLabelText(/Routing engine/i)
    cy.findByLabelText(/Bounds of analysis/i)
    //.should('match',/Entire region/i) // TODO matches wrong element
    // start analysis from default marker position
    cy.findByText(/Fetch Results/i).click()
    cy.findByText(/Analyze results/i, {timeout: 200000}).should('exist')
    // move the marker and re-run
    cy.mapMoveMarkerTo([39.08877, -84.5106]) // to transit center
    cy.findByText(/Fetch Results/i).click()
    cy.get('@multi-point-main').should('not.be.disabled')
    //cy.get('@map').matchImageSnapshot('post')
  })

  it('can set bookmark')
  it('can run a regional analysis')
})
