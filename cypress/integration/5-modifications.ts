/**
 * Modification Tests (Basic)
 *
 * CRUD, form validation, and map interactions for all types.
 * Tests that verify analysis results should go in the
 * Advanced Modifications group.
 */

// All modification types
const types = [
  'Add Streets',
  'Add Trip Pattern',
  'Adjust Dwell Time',
  'Adjust Speed',
  'Convert To Frequency',
  'Modify Streets',
  'Remove Stops',
  'Remove Trips',
  'Reroute',
  'Custom'
] as const

// Convert above array to an enum
type ModificationType = typeof types[number]

/**
 *  Helper functions
 */

const modificationPrefix = Cypress.env('dataPrefix') + 'MOD'
const createModName = (type, description = '') =>
  `${modificationPrefix}${type}${description}${Date.now()}`

const scenarioName = Cypress.env('dataPrefix') + 'SCENARIO'
const scenarioNameRegEx = new RegExp(scenarioName, 'g')

const getMap = () => cy.get('div.leaflet-container')
const selectFeed = (feedName) => {
  cy.findByLabelText(/Select feed/)
    .click({force: true})
    .type(feedName + '{enter}')
}
const selectRoute = (routeName) => {
  cy.findByLabelText(/Select route/)
    .click({force: true})
    .type(routeName + '{enter}')
}

function setupScenario(name) {
  // open the scenarios tab
  cy.findByRole('tab', {name: 'Scenarios'}).click()
  cy.get('#scenarios').then((el) => {
    // create named scenario if it doesn't already exist
    if (!el.text().includes(name)) {
      cy.findByRole('button', {name: 'Create a scenario'}).click()
      // TODO there has GOT to be a better way...
      cy.wrap(el)
        .findByText(/Scenario \d/)
        .parent()
        .parent()
        .parent()
        .click()
        .parent()
        .findByDisplayValue(/Scenario \d/)
        .type(name + '{enter}')
    }
  })
  cy.findAllByRole('tab', {name: /Modifications/g}).click()
}

// Delete an open modification
function deleteThisMod() {
  cy.findByRole('button', {name: 'Delete modification'}).click()
  cy.findByRole('button', {name: 'Confirm: Delete modification'}).click()
  cy.findByRole('dialog').should('not.exist')
  cy.contains('Create a modification')
  cy.wait(100) // eslint-disable-line
  cy.navComplete() // Modifications are not loaded in GetInitialProps
}

function openMod(modType: ModificationType, modName) {
  // opens the first listed modification of this type with this name
  cy.navTo('edit modifications')
  cy.findByRole('tab', {name: /Modifications/g}).click()
  // find the container for this modification type and open it if need be
  cy.findByText(modType)
    .parent()
    .parent()
    .as('modList')
    .then((modList) => {
      if (!modList.text().includes(modName)) {
        cy.wrap(modList).click()
      }
    })
  cy.get('@modList').contains(modName).click()
  cy.location('pathname').should('match', /.*\/modifications\/.{24}$/)
  cy.contains(modName)
}

function deleteMod(modType: ModificationType, modName) {
  openMod(modType, modName)

  cy.findByRole('button', {name: 'Delete modification'}).click()
  cy.findByRole('button', {name: 'Confirm: Delete modification'}).click()
  cy.contains('Create a modification')
  cy.findByText(modName).should('not.exist')
}

function setupMod(modType: ModificationType, modName) {
  // assumes we are already on this page or editing another mod
  cy.findByText('Create a modification').click()
  cy.findByLabelText(/Modification name/i).type(modName)
  if (modType.indexOf('Street') > -1) {
    cy.findByText('Street').click()
    cy.findByLabelText(/Street modification type/i).select(modType)
  } else {
    cy.findByLabelText(/Transit modification type/i).select(modType)
  }
  cy.findByText('Create').click()
  cy.findByRole('dialog').should('not.exist')
  cy.navComplete()
  cy.location('pathname').should('match', /.*\/modifications\/.{24}$/)
}

function drawRouteGeometry(newRoute: [number, number][]) {
  cy.findByText(/Edit route geometry/i)
    .click()
    .contains(/Stop editing/i)
  cy.getLeafletMap().then((map) => {
    map.fitBounds(newRoute, {animate: false})
    cy.waitForMapToLoad()
    // click at the coordinates
    newRoute.forEach((point, i) => {
      const pix = map.latLngToContainerPoint(point)
      getMap().click(pix.x, pix.y)
      if (i > 0) {
        cy.contains(new RegExp(i + 1 + ' stops over \\d\\.\\d+ km'))
      }
    })
    // convert an arbitrary stop to a control point
    const stop = newRoute[newRoute.length - 2]
    const pix = map.latLngToContainerPoint(stop)
    getMap().click(pix.x, pix.y)
    getMap()
      .findByText(/make control point/)
      .click()
    // control point not counted as stop
    cy.contains(new RegExp(newRoute.length - 1 + ' stops over \\d\\.\\d+ km'))
    // convert control point back to stop
    getMap().click(pix.x, pix.y)
    getMap()
      .findByText(/make stop/)
      .click()
    cy.contains(new RegExp(newRoute.length + ' stops over \\d\\.\\d+ km'))
  })
  cy.findByText(/Stop editing/i).click()
}

/**
 * Remove all old modifications that contain the temporary prefix
 */
function clearAllModifications() {
  return cy
    .get('body')
    .then(($body) => {
      return $body.find('button[aria-label="Edit modification"]')
    })
    .then((buttons) => {
      if (buttons.length > 0) {
        cy.wrap(buttons[0]).click()
        deleteThisMod()
        return clearAllModifications()
      }
    })
}

describe('Modifications (Basic)', () => {
  before(function () {
    cy.setup('project')
    clearAllModifications() // clean uo for development
    setupScenario(scenarioName)
  })

  beforeEach(() => {
    cy.goToEntity('project')
    cy.findByRole('tab', {name: /Modifications/g}).click()
    cy.fixture('regions/scratch.json').as('region')
  })

  after(() => {
    cy.goToEntity('project') // Navigates directly to the project
    clearAllModifications() // Delete all of the modifications
  })

  types.forEach((type) => {
    it(`CRU(D) ${type}`, function () {
      const name = createModName(type, 'simple')
      const description = 'distinctly descriptive text'
      // Create the modification
      setupMod(type, name)
      cy.contains(name)

      // Update the description
      cy.findByText(/Add description/)
        .parent() // necessary because text element becomes detached
        .parent()
        .click({force: true})
        .type(description)

      // Update the variatns
      cy.findByLabelText(/Default/).uncheck({force: true})
      cy.findByLabelText(scenarioNameRegEx).check({force: true})

      // Test the type specific elements
      formCheck(type, this.region)

      // Go back to the list to force a save
      cy.findByRole('button', {name: /^Modifications$/}).click()
      cy.navComplete()

      // Read the saved settings
      openMod(type, name)
      cy.findByText(description)
      cy.findByLabelText(/Default/).should('not.be.checked')
      cy.findByLabelText(scenarioNameRegEx).should('be.checked')

      // Do not delete yet. More modifications for the report view.
    })
  })

  it('can be imported from shapefile', function () {
    cy.findByRole('button', {
      name: 'Import modifications from another project'
    }).click()
    cy.location('pathname').should('match', /import-modifications$/)
    // TODO need better selector for button
    cy.findByRole('button', {name: /Import from Shapefile/}).click()
    cy.location('pathname').should('match', /import-shapefile/g)
    cy.findByLabelText(/Select Shapefile/i).attachFile({
      filePath: this.region.importRoutes.shapefile,
      mimeType: 'application/octet-stream',
      encoding: 'base64'
    })
    cy.findByLabelText(/Name/).select(this.region.importRoutes.nameField)
    cy.findByLabelText(/Frequency/).select(
      this.region.importRoutes.frequencyField
    )
    cy.findByLabelText(/Speed/).select(this.region.importRoutes.speedField)
    cy.findByText(/Import/)
      .should('not.be.disabled')
      .click()

    cy.location('pathname').should('match', /projects\/.{24}\/modifications/)

    this.region.importRoutes.routes.forEach((route) => {
      openMod('Add Trip Pattern', route.name)
      cy.findByRole('button', {name: /Timetable 1/}).click({force: true})
      cy.findByLabelText(/Frequency/)
        .invoke('val')
        .then((val) => expect(val).to.eq('' + route.frequency))
      cy.findByLabelText(/Average speed/i)
        .invoke('val')
        .then((val) => expect(val).to.eq('' + route.speed))
      deleteThisMod()
    })
  })

  it('can be drawn on map', function () {
    const modName = createModName('ATP', 'draw on map')
    setupMod('Add Trip Pattern', modName)
    cy.findAllByRole('alert').contains(/must have at least 2 stops/)
    cy.findAllByRole('alert').contains(/needs at least 1 timetable/)
    // add a route geometry
    drawRouteGeometry(this.region.newRoute)

    cy.findAllByRole('alert')
      .contains(/must have at least 2 stops/)
      .should('not.exist')
    cy.findByLabelText(/Auto-create stops at set spacing/i).check({
      force: true
    })

    cy.findByLabelText(/Bidirectional/i)
      .uncheck({force: true})
      .should('not.be.checked')
    // add a timetable
    cy.findByText(/Add new timetable/i).click()
    cy.findByRole('alert', {name: /needs at least 1 timetable/}).should(
      'not.exist'
    )
    deleteThisMod()
  })

  it('can create and reuse timetables', function () {
    const modName = createModName('ATP', 'timetable templates')
    setupMod('Add Trip Pattern', modName)
    // add a route geometry
    drawRouteGeometry(this.region.newRoute)

    cy.findByText(/Add new timetable/).click()
    cy.findByText('Timetable 1').click({force: true})
    // enter arbitrary settings to see if they get saved
    cy.findByLabelText('Name').clear().type('Weekday')
    cy.findByLabelText(/Mon/).check()
    cy.findByLabelText(/Tue/).check()
    cy.findByLabelText(/Wed/).check()
    cy.findByLabelText(/Thu/).check()
    cy.findByLabelText(/Fri/).check()
    cy.findByLabelText(/Sat/).uncheck({force: true})
    cy.findByLabelText(/Sun/).uncheck({force: true})
    cy.findByLabelText(/Frequency/)
      .clear()
      .type('00:20:00')
    cy.findByLabelText(/Start time/)
      .clear()
      .type('06:00')
    cy.findByLabelText(/End time/)
      .clear()
      .type('23:00')
    cy.findByLabelText(/dwell time/)
      .clear()
      .type('00:00:30')
    cy.findByText('Weekday').click({force: true}) // hide panel

    // Copy the current modification
    cy.findByRole('button', {name: /Copy modification/i}).click()
    cy.loadingComplete()
    cy.get('#react-toast').findByRole('alert').click({force: true})
    cy.navComplete()

    cy.findByText(/Copy existing timetable/).click()
    cy.findByRole('dialog').should('exist')
    cy.findByRole('dialog').as('dialog')
    cy.get('@dialog')
      .findByText(/Loading/)
      .should('not.exist')
    cy.get('@dialog')
      .findByLabelText(/Region/)
      .select(Cypress.env('dataPrefix') + 'scratch')
    cy.get('@dialog')
      .findByLabelText(/Project/)
      .select(Cypress.env('dataPrefix') + 'scratch project')
    cy.get('@dialog')
      .findByLabelText(/Modification/)
      .select(modName)
    cy.get('@dialog')
      .findByLabelText(/Timetable/)
      .select('Weekday')
    cy.findByText(/Copy into new timetable/i).click()
    cy.contains(/copy of Weekday/i).click({force: true})
    // verify the settings from above
    cy.findByLabelText(/Mon/).should('be.checked')
    cy.findByLabelText(/Tue/).should('be.checked')
    cy.findByLabelText(/Wed/).should('be.checked')
    cy.findByLabelText(/Thu/).should('be.checked')
    cy.findByLabelText(/Fri/).should('be.checked')
    cy.findByLabelText(/Sat/).should('not.be.checked')
    cy.findByLabelText(/Sun/).should('not.be.checked')
    cy.findByLabelText(/Frequency/)
      .invoke('val')
      .then((val) => expect(val).to.eq('00:20:00'))
    cy.findByLabelText(/Start time/)
      .invoke('val')
      .then((val) => expect(val).to.eq('06:00'))
    cy.findByLabelText(/End time/)
      .invoke('val')
      .then((val) => expect(val).to.eq('23:00'))
    // delete the temp modification
    deleteThisMod()
    // delete the template modification
    deleteMod('Add Trip Pattern', modName)
  })

  describe('Download and share modifications', () => {
    before(() => {
      cy.wrap(
        Cypress.automation('remote:debugger:protocol', {
          command: 'Page.setDownloadBehavior',
          params: {behavior: 'allow', downloadPath: 'cypress/downloads'}
        }),
        {log: false}
      )
    })

    it('should download the scenario, routes, and stops', () => {
      cy.findByRole('button', {name: /Download or share this project/}).click()

      cy.findAllByRole('button', {name: /Raw scenario/})
        .first()
        .click()

      cy.findAllByRole('button', {name: /New alignments/})
        .first()
        .click()

      cy.findAllByRole('button', {name: /New stops/})
        .first()
        .click()

      cy.findByRole('button', {name: /Close/}).click()
    })

    it('should show a report of all the modifications', () => {
      cy.findByRole('button', {name: /Download or share this project/}).click()

      cy.findAllByRole('button', {name: /Summary Report/i})
        .first()
        .click()

      cy.findByRole('dialog').should('not.exist')
    })
  })
})

/**
 * Choose which set of tests to run depending on the modification type.
 * The following tests should be basic. Checking the existence of form
 * elements and whether or not they work as intended -- including form
 * validation. Tests for how these modifications affect results should
 * go in the "Advanced Modifications" group.
 */
function formCheck(type: ModificationType, region) {
  switch (type) {
    case 'Add Trip Pattern':
      return testAddTripPattern(region)
    case 'Add Streets':
      return testAddStreets()
    case 'Adjust Dwell Time':
      return testAdjustDwellTime(region)
    case 'Adjust Speed':
      return testAdjustSpeed(region)
    case 'Convert To Frequency':
      return testConvertToFrequency(region)
    case 'Modify Streets':
      return testModifyStreets()
    case 'Remove Stops':
      return testRemoveStops(region)
    case 'Remove Trips':
      return testRemoveTrips(region)
    case 'Reroute':
      return testReroute(region)
    default:
      console.log('Not yet implemented...')
      break
  }
}

function testAddStreets() {
  const force = {force: true}
  cy.findByLabelText(/Enable walking/i).as('walkAccess')
  cy.findByLabelText(/Enable biking/i).as('bikeAccess')
  cy.findByLabelText(/Enable driving/i).as('carAccess')
  // toggling access changes options
  // WALK
  cy.findByLabelText(/Walk time factor/i)
  cy.get('@walkAccess').uncheck(force)
  cy.findByLabelText(/Walk time factor/i).should('not.exist')
  // BIKE
  cy.findByLabelText(/Bike time factor/i)
  cy.findByLabelText(/Bike level of Traffic Stress/i)
  cy.get('@bikeAccess').uncheck(force)
  cy.findByLabelText(/Bike time factor/i).should('not.exist')
  cy.findByLabelText(/Bike level of Traffic Stress/i).should('not.exist')
  // DRIVE
  cy.findByLabelText(/Car speed/i)
  cy.get('@carAccess').uncheck(force)
  cy.findByLabelText(/Car speed/i).should('not.exist')
  // map interaction
  cy.findByTitle(/Draw a polyline/i)
}

function testAddTripPattern(region) {
  cy.findByLabelText(/Transit Mode/i).select('Tram')
  cy.findAllByRole('alert').contains(/must have at least 2 stops/)
  cy.findByRole('button', {name: /Edit route geometry/i}).as('edit')
  cy.findAllByRole('alert').contains(/needs at least 1 timetable/)
  cy.findByRole('button', {name: /Add new timetable/i}).click()
  cy.findByRole('button', {name: /Timetable 1/}).click({force: true})
  cy.findByLabelText(/Times are exact/i).uncheck({force: true})
  cy.findByLabelText(/Phase at stop/i)
  // drawing a route activates the following elements
  drawRouteGeometry(region.newRoute)
  // set dwell times, verifying that they increase the total travel time
  cy.findByText(/Travel time/i)
    .parent()
    .findByText(/\d\d:\d\d:\d\d/)
    .as('travelTime')
    .invoke('text')
    .then((initialTime) => {
      // now set a new dwell time
      const dwellTime = '00:00:30'
      cy.findByLabelText(/Default dwell time/i)
        .clear()
        .type(dwellTime)
      cy.findByRole('button', {
        name: /Set individual stop dwell times/i
      }).click()
      cy.findByLabelText(/Stop 1/)
        .invoke('attr', 'placeholder')
        .should('eq', `${dwellTime} (default)`)
      cy.get('@travelTime')
        .invoke('text')
        .then(
          // compares interval strings, but because of the format it works
          (newTime) => expect(newTime > initialTime).to.be.true
        )
    })
  // set segment speeds
  cy.findByLabelText(/Average speed/i)
  cy.findByLabelText(/Total moving time/i)
  cy.findByRole('button', {name: /Set individual segment speeds/i}).click()
  // decreasing segment speed should increase travel time
  cy.findByLabelText(/Segment 1 speed/i)
    .itsNumericValue()
    .should('not.be.NaN')
    .then((segSpeed) => {
      cy.get('@travelTime')
        .invoke('text')
        .then((initialTime) => {
          cy.findByLabelText(/Segment 1 speed/i)
            .clear()
            .type(`${segSpeed * 0.5}`)
          cy.get('@travelTime')
            .invoke('text')
            .then((newTime) => {
              cy.log(newTime, initialTime)
              expect(newTime > initialTime).to.be.true
            })
        })
    })
  cy.findByLabelText(/Segment 1 duration/i)
    .invoke('val')
    .should('match', /\d\d:\d\d:\d\d/)
}

function testAdjustDwellTime(region) {
  selectFeed(region.feedAgencyName)
  selectRoute(region.sampleRouteName)

  cy.findByLabelText(/Select patterns/i)
  cy.findByLabelText(/Scale existing dwell times by/i).click({force: true})
  cy.findByLabelText(/Set new dwell time to/i).click({force: true})
}

function testAdjustSpeed(region) {
  selectFeed(region.feedAgencyName)
  selectRoute(region.sampleRouteName)

  cy.findByLabelText(/Select patterns/i)
  cy.findByLabelText(/Scale speed by/i)
    .itsNumericValue()
    .should('eq', 1)
}

function testConvertToFrequency(region) {
  selectFeed(region.feedAgencyName)
  selectRoute(region.sampleRouteName)
  cy.findByLabelText(/retain existing scheduled trips/i).click({
    force: true
  })
  cy.findByText(/Add frequency entry/i).click()
  cy.findByLabelText(/Select patterns/i)
    .click({force: true})
    .type('Bakewell{enter}')
  cy.findByLabelText(/Frequency/i)
    .clear()
    .type('00:20:00')
  cy.findByLabelText(/Start time/i)
    .clear()
    .type('09:00')
  cy.findByLabelText(/End time/i)
    .clear()
    .type('23:00')
  cy.findByLabelText(/Phase at stop/i)
    .click({force: true})
    .type('Fountain Square{enter}')
  cy.findByRole('button', {name: 'Delete frequency entry'}).click()
  cy.findByRole('button', {name: 'Confirm: Delete frequency entry'}).click()
}

function testModifyStreets() {
  const force = {force: true}
  cy.findByLabelText(/Enable walking/i).as('walkAccess')
  cy.findByLabelText(/Enable biking/i).as('bikeAccess')
  cy.findByLabelText(/Enable driving/i).as('carAccess')
  // toggling access changes options
  // WALK
  cy.findByLabelText(/Walk time factor/i)
  cy.get('@walkAccess').uncheck(force)
  cy.findByLabelText(/Walk time factor/i).should('not.exist')
  // BIKE
  cy.findByLabelText(/Bike time factor/i)
  cy.findByLabelText(/Bike level of Traffic Stress/i)
  cy.get('@bikeAccess').uncheck(force)
  cy.findByLabelText(/Bike time factor/i).should('not.exist')
  cy.findByLabelText(/Bike level of Traffic Stress/i).should('not.exist')
  // DRIVE
  cy.findByLabelText(/Car speed/i)
  cy.get('@carAccess').uncheck(force)
  cy.findByLabelText(/Car speed/i).should('not.exist')
  // map interaction
  cy.findByTitle(/Draw a polygon/i)
}

function testRemoveTrips(region) {
  selectFeed(region.feedAgencyName)
  selectRoute(region.sampleRouteName)
  cy.findByLabelText(/Select patterns/i)
}

function testRemoveStops(region) {
  selectFeed(region.feedAgencyName)
  selectRoute(region.sampleRouteName)
  // can't interact with these yet - leave all at defaults
  cy.findByLabelText(/Select patterns/i)
  cy.findByLabelText(/Time savings per removed stop/i)
  // select stops
  //cy.get('a.btn').contains('New').click()
  //cy.get('div.leaflet-container').as('map')
}

function testReroute(region) {
  selectFeed(region.feedAgencyName)
  selectRoute(region.sampleRouteName)

  // verify existence only
  cy.findByLabelText(/Select patterns/i)

  // Select from stop and to stop
  cy.getLeafletMap().then((map) => {
    cy.findByLabelText(/Select from stop/).click()
    const p1 = map.latLngToContainerPoint([39.0877, -84.5192])
    getMap().click(p1.x, p1.y)
    // test clearing the from stop
    cy.findByLabelText(/Clear from stop/).click()

    // Re-select the from stop
    cy.findByLabelText(/Select from stop/).click()
    getMap().click(p1.x, p1.y)

    // Select the to stop
    cy.findByLabelText(/Select to stop/).click()
    const p2 = map.latLngToContainerPoint([39.1003, -84.4855])
    getMap().click(p2.x, p2.y)
  })

  cy.findByLabelText(/Default dwell time/i).type('00:10:00')
  cy.findByLabelText(/Average speed/i).type('25')
  cy.findByLabelText(/Total moving time/i).type('01:00:00')
}
