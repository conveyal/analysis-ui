function setCustom(settingKey, newValue, scenario = 'primary') {
  // sets a value in the "Customize Profile Request" box
  let newConfig = {}
  cy.get(`@${scenario}`)
    .findByLabelText(/Customize Profile Request/i)
    .as('profile')
    .invoke('val')
    .then((currentConfig) => {
      newConfig = JSON.parse(currentConfig)
      newConfig[settingKey] = newValue
      cy.get('@profile')
        .invoke('val', JSON.stringify(newConfig, null, 2))
        .trigger('change') // TODO not updating map
    })
}

function fetchResults() {
  cy.findByText(/Fetch Results/i).click()
  // wait for results
  cy.findByText(/Fetch Results/i).should('not.exist')
  cy.findByText(/Fetch Results/i).should('exist')
}

context('Analysis', () => {
  before(() => {
    cy.setup('project')
    cy.setup('opportunities')
  })
  beforeEach(() => {
    cy.navTo('edit modifications') // refresh analysis page by navigating away
    cy.navTo('Analyze')
    // alias lots of things
    cy.get('div.leaflet-container').as('map')
    cy.get('div#PrimaryAnalysisSettings').as('primary')
    cy.get('div#ComparisonAnalysisSettings').as('comparison')
    // set a standard project, scenario, and opportunity dataset
    // across all tests
    cy.get('@primary')
      .findByLabelText(/^Project$/)
      .click({force: true})
      .type('scratch{enter}')
    cy.get('@primary')
      .findByLabelText(/^Scenario$/)
      .click({force: true})
      .type('baseline{enter}')
    cy.findByLabelText(/^Opportunity Dataset$/)
      .click({force: true})
      .type('default{enter}')
      .should('be.disabled') // becomes disabled while loading
    // enabled again once loaded
    cy.findByLabelText(/^Opportunity Dataset$/).should('be.enabled')
  })

  context('of a point', () => {
    it('has all form elements', function () {
      // note that elements touched in beforeEach are neglected here
      cy.findByLabelText(/Time cutoff/i)
      cy.findByLabelText(/Travel time percentile/i)
      cy.get('@primary')
        .findByRole('button', {name: 'Multi-point'})
        .should('be.disabled')
      cy.get('@primary').contains('scratch project')
      cy.get('@primary').contains('Baseline')
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
      cy.get('@primary').findByLabelText(/Customize Profile Request/i)
      cy.findByText(/Fetch Results/i).should('be.enabled')
    })

    it('runs, giving <del>reasonable</del> results', function () {
      // enable all fields by initializing request with defaults
      fetchResults()
      // set new parameters
      cy.findByLabelText(/Time cutoff/i)
        .invoke('val', 75) // TODO not working
        .trigger('change', {force: true})
      cy.findByLabelText(/Travel time percentile/i)
        .invoke('val', 75) // TODO not working yet
        .trigger('change', {force: true})
      // move marker and align map for snapshot
      setCustom('fromLat', 39.08877)
      setCustom('fromLon', -84.5106) // TODO not updating marker
      cy.centerMapOn([39.08877, -84.5106])
      fetchResults()
      //cy.get('@map').matchImageSnapshot()
    })

    it.skip('gives different results at different times', function () {
      // set time window in morning rush
      cy.findByLabelText(/From time/i)
        .clear()
        .type('06:00')
      cy.findByLabelText(/To time/i)
        .clear()
        .type('08:00')
      fetchResults()
      //cy.get('@map').matchImageSnapshot() // TODO
      // set time window in late evening
      cy.findByLabelText(/From time/i)
        .clear()
        .type('22:00')
      cy.findByLabelText(/To time/i)
        .clear()
        .type('23:59')
      fetchResults()
      //cy.get('@map').matchImageSnapshot() // TODO
      // TODO narrow window to one minute and ensure no variability
    })

    it('charts accessibility', function () {
      // TODO move marker and verify other settings
      fetchResults()
      cy.get('svg#results-chart')
      // TODO take snapshot
    })

    it('sets custom analysis bounds')

    it('sets a bookmark')

    it('handles access by walk/bike only')
  })

  context('of a region', () => {
    it.skip('runs a regional analysis', function () {
      fetchResults()
      cy.get('@primary')
        .findByRole('button', {name: 'Multi-point'})
        .should('be.enabled')
    })

    it('compares two regional analyses')

    it('uploads an aggregation area')

    it('aggregates results to subregion')
  })
})
