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
        .type(' {backspace}')
      // TODO this last type action triggers some kind of event that updates
      // the map. Figure out how to trigger it directly.
      // is .trigger('input') not passing a target?
    })
}

function setOrigin(latLonArray) {
  setCustom('fromLat', latLonArray[0])
  setCustom('fromLon', latLonArray[1])
}

function fetchResults() {
  cy.findByText(/Fetch Results/i).click()
  cy.wait(200) // eslint-disable-line cypress/no-unnecessary-waiting
  cy.findByText(/Fetch Results/i).should('exist')
}

function setTimeCutoff(minutes) {
  // TODO not actually moving the slider yet
  cy.findByLabelText(/Time cutoff/i)
    .parent()
    .findByRole('slider')
    .invoke('val', minutes)
    .trigger('input', {force: true})
}

context('Analysis', () => {
  before(() => {
    cy.setup('project')
    cy.setup('opportunities')
  })

  beforeEach(() => {
    cy.navTo('edit modifications') // refresh analysis page by navigating away
    cy.navTo('Analyze')
    cy.fixture('regions/scratch.json').as('region')
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
    //.should('be.disabled') // may become disabled while loading
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

    it('runs, giving reasonable results', function () {
      // tests basic single point analysis at specified locations
      // compares mapped results to snapshots
      fetchResults() // initialize request
      // set new parameters
      setTimeCutoff(75)
      // move marker and align map for snapshot
      for (let key in this.region.locations) {
        let location = this.region.locations[key]
        setOrigin(location)
        cy.centerMapOn(location)
        fetchResults()
        //cy.get('@map').matchImageSnapshot() // TODO
      }
    })

    it('gives different results at different times', function () {
      const location = this.region.locations.center
      setOrigin(location)
      cy.centerMapOn(location)
      // set time window in morning rush -- should have high access
      cy.findByLabelText(/From time/i)
        .as('from')
        .clear()
        .type('06:00')
      cy.findByLabelText(/To time/i)
        .as('to')
        .clear()
        .type('08:00')
      fetchResults()
      //cy.get('@map').matchImageSnapshot() // TODO
      // set time window in late evening - lower access
      cy.get('@from').clear().type('22:00')
      cy.get('@to').clear().type('23:59')
      fetchResults()
      //cy.get('@map').matchImageSnapshot() // TODO
      // narrow window to one minute - no variability
      cy.get('@from').clear().type('12:00')
      cy.get('@to').clear().type('12:01')
      // TODO snapshot chart too
    })

    it('handles direct access by walk/bike only', function () {
      const location = this.region.locations.middle
      setOrigin(location)
      // turn off all transit
      cy.get('@primary')
        .findByLabelText(/Transit modes/i)
        .findByRole('button', {name: /All/i})
        .click()
      cy.get('@primary')
        .findByLabelText(/Access mode/i)
        .should('not.exist')
      // it has changed names, becoming:
      cy.get('@primary')
        .findByLabelText(/Direct mode/i)
        .findByTitle(/Bike/i)
        .click()
      cy.get('@primary')
        .findByLabelText(/Egress mode/i)
        .findAllByRole('button')
        .should('be.disabled')
      fetchResults()
      // TODO take snapshot of map and chart
    })

    it('charts accessibility', function () {
      const location = this.region.locations.center
      setOrigin(location)
      fetchResults()
      cy.get('svg#results-chart')
        .as('chart')
        .scrollIntoView()
        .matchImageSnapshot('single-scenario-chart')
      // add a comparison case to the chart
      cy.get('@comparison')
        .findByLabelText(/^Project$/)
        .click({force: true})
        .type('scratch{enter}')
      cy.get('@comparison')
        .findByLabelText(/^Scenario$/)
        .click({force: true})
        .type('baseline{enter}')
      // change the mode
      cy.get('@comparison')
        .findByLabelText(/Identical request settings/i)
        .uncheck({force: true})
      cy.get('@comparison')
        .findByLabelText(/Access mode/i)
        .findByTitle(/Bike/i)
        .click()
      fetchResults()
      cy.get('@chart')
        .scrollIntoView()
        .matchImageSnapshot('chart-with-comparison')
    })

    it('uses custom analysis bounds', function () {
      const location = this.region.locations.center
      setOrigin(location)
      cy.centerMapOn(location)
      setCustom('bounds', this.region.customRegionSubset)
      fetchResults()
      // TODO
      //cy.get('@map').matchImageSnapshot('map-with-custom-bounds')
    })

    it('sets a bookmark')
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
