context('Analysis', () => {
  before(() => {
    cy.setup('project')
    cy.setup('opportunities')
    cy.navTo('Analyze')
  })
  beforeEach(() => {
    cy.get('div.leaflet-container').as('map')
    cy.get('div#PrimaryAnalysisSettings').as('primary')
    cy.get('div#ComparisonAnalysisSettings').as('comparison')
  })

  context('of a point', () => {
    it('has all form elements', function () {
      //cy.findByLabelText(/Time cutoff/i) // TODO dissociated label
      cy.findByLabelText(/Travel time percentile/i) // note: hidden input
      cy.get('@primary')
        .findByRole('button', {name: 'Multi-point'})
        .as('multi-point-main')
        .should('be.disabled')
      // select project and scenario
      cy.get('@primary')
        .findByLabelText(/^Project$/)
        .click({force: true})
        .type('scratch{enter}')
      cy.get('@primary').contains('scratch project')
      cy.get('@primary')
        .findByLabelText(/^Scenario$/)
        .click({force: true})
        .type('baseline{enter}')
      cy.get('@primary').contains('Baseline')
      cy.findByLabelText(/^Opportunity Dataset$/)
        .click({force: true})
        .type('default{enter}')
      cy.get('@primary').findAllByLabelText(/Bookmark/)
      cy.get('@primary').findByLabelText(/Access mode/i)
      cy.get('@primary').findByLabelText(/Transit modes/i)
      cy.get('@primary').findByLabelText(/Egress mode/i)
      cy.findByLabelText(/Walk speed/i)
      cy.findByLabelText(/Max walk time/i)
      cy.get('@primary').findByLabelText(/Date/i)
      cy.findByLabelText(/From time/i)
      cy.findByLabelText(/To time/i)
      cy.get('@primary').findByLabelText(/Simulated Schedules/i)
      cy.get('@primary').findByLabelText(/Maximum transfers/i)
      cy.findByLabelText(/Routing engine/i)
      cy.get('@primary').findAllByLabelText(/Bounds of analysis/i)
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

    it('runs, giving reasonable results')

    it('gives different results at different times')

    it('charts accessibility')

    it('sets custom analysis bounds')

    it('sets a bookmark')

    it('handles access by walk/bike only')
  })

  context('of a region', () => {
    it('runs a regional analysis')

    it('compares two regional analyses')

    it('uploads an aggregation area')

    it('aggregates results to subregion')
  })
})
