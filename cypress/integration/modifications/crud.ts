/**
 * Basic Modification Tests
 *
 * CRUD, form validation, and map interactions for all types.
 * Tests that verify analysis results should go in the
 * Advanced Modifications group.
 */
import {
  ModificationTypes,
  setupModificationTests,
  testModification
} from '../utils'

const scenarioName = Cypress.env('dataPrefix') + 'SCENARIO'
const scenarioNameRegEx = new RegExp(scenarioName, 'g')

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

setupModificationTests('basic', () => {
  before(() => {
    setupScenario(scenarioName)
  })

  /**
   * Repeat the same modification simple tests for each modification type.
   * Each modification contains the same basic form element indicating that
   * they may not need to be tested individually. But instances have occured
   * where the invidiual modification bodies have caused elements outside of
   * the modification to fail or work incorrectly. Therefore it is necessary
   * run these simple tests for each modification type.
   */
  ModificationTypes.forEach((type) => {
    testModification(
      {
        title: 'CRUD',
        type
      },
      function (name) {
        const description = 'distinctly descriptive text'
        cy.contains(name)

        // Update the description
        cy.findByText(/Add description/)
          .parent() // necessary because text element becomes detached
          .parent()
          .click({force: true})
          .type(description)

        // Update the variants
        cy.findByLabelText(/Default/).uncheck({force: true})
        cy.findByLabelText(scenarioNameRegEx).check({force: true})

        // Test the type specific elements
        formCheck(type, this.region)

        // Navigate away and expand the map to the modification
        cy.centerMapOn([0, 0])
        cy.findByRole('button', {
          name: /Fit map to modification extents/
        }).click()

        // Go back to the list to force a save
        cy.findByRole('button', {name: /^Modifications$/}).click()
        cy.navComplete()

        // Read the saved settings
        cy.openModification(name)
        cy.findByText(description)
        cy.findByLabelText(/Default/).should('not.be.checked')
        cy.findByLabelText(scenarioNameRegEx).should('be.checked')
      }
    )
  })

  it('can be imported from shapefile', function () {
    cy.findByRole('button', {
      name: 'Import modifications from another project'
    }).click()
    cy.navComplete()

    cy.findByRole('button', {name: /Import from Shapefile/}).click()
    cy.navComplete()

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
    cy.navComplete()

    cy.location('pathname').should('match', /projects\/.{24}\/modifications/)

    this.region.importRoutes.routes.forEach((route) => {
      cy.openModification(route.name)
      cy.findByRole('button', {name: /Timetable 1/}).click({force: true})
      cy.findByLabelText(/Frequency/)
        .invoke('val')
        .then((val) => expect(val).to.eq('' + route.frequency))
      cy.findByLabelText(/Average speed/i)
        .invoke('val')
        .then((val) => expect(val).to.eq('' + route.speed))
      cy.deleteThisModification()
    })
  })

  testModification(
    {
      type: 'Add Trip Pattern',
      title: 'draw on map'
    },
    function () {
      cy.findAllByRole('alert').contains(/must have at least 2 stops/)
      cy.findAllByRole('alert').contains(/needs at least 1 timetable/)
      // add a route geometry
      cy.drawRouteGeometry(this.region.newRoute)

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
    }
  )

  testModification(
    {
      type: 'Add Trip Pattern',
      title: 'create and reuse timetables'
    },
    function (modName) {
      // add a route geometry
      cy.drawRouteGeometry(this.region.newRoute)

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
        .should('eq', '00:20:00')
      cy.findByLabelText(/Start time/)
        .invoke('val')
        .should('eq', '06:00')
      cy.findByLabelText(/End time/)
        .invoke('val')
        .should('eq', '23:00')
      // Delete the copied modification
      cy.deleteThisModification()
    }
  )

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
function formCheck(type: Cypress.ModificationType, region) {
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
  cy.drawRouteGeometry(region.newRoute)
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
  cy.selectFeed(region.feedAgencyName)
  cy.selectRoute(region.sampleRouteName)

  cy.findByLabelText(/Select patterns/i)
  cy.findByLabelText(/Scale existing dwell times by/i).click({force: true})
  cy.findByLabelText(/Set new dwell time to/i).click({force: true})
}

function testAdjustSpeed(region) {
  cy.selectFeed(region.feedAgencyName)
  cy.selectRoute(region.sampleRouteName)

  cy.findByLabelText(/Select patterns/i)
  cy.findByLabelText(/Scale speed by/i)
    .itsNumericValue()
    .should('eq', 1)
}

function testConvertToFrequency(region) {
  cy.selectFeed(region.feedAgencyName)
  cy.selectRoute(region.sampleRouteName)
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
  cy.selectFeed(region.feedAgencyName)
  cy.selectRoute(region.sampleRouteName)
  cy.findByLabelText(/Select patterns/i)
}

function testRemoveStops(region) {
  cy.selectFeed(region.feedAgencyName)
  cy.selectRoute(region.sampleRouteName)
  // can't interact with these yet - leave all at defaults
  cy.findByLabelText(/Select patterns/i)
  cy.findByLabelText(/Time savings per removed stop/i)
  // select stops
  //cy.get('a.btn').contains('New').click()
  //cy.get('div.leaflet-container').as('map')
}

function testReroute(region) {
  cy.selectFeed(region.feedAgencyName)
  cy.selectRoute(region.sampleRouteName)

  // verify existence only
  cy.findByLabelText(/Select patterns/i)

  // Select from stop and to stop
  cy.getLeafletMap().then((map) => {
    cy.findByLabelText(/Select from stop/).click()
    const p1 = map.latLngToContainerPoint([39.0877, -84.5192])
    cy.getMapDiv().click(p1.x, p1.y)
    // test clearing the from stop
    cy.findByLabelText(/Clear from stop/).click()

    // Re-select the from stop
    cy.findByLabelText(/Select from stop/).click()
    cy.getMapDiv().click(p1.x, p1.y)

    // Select the to stop
    cy.findByLabelText(/Select to stop/).click()
    const p2 = map.latLngToContainerPoint([39.1003, -84.4855])
    cy.getMapDiv().click(p2.x, p2.y)
  })

  cy.findByLabelText(/Default dwell time/i).type('00:10:00')
  cy.findByLabelText(/Average speed/i).type('25')
  cy.findByLabelText(/Total moving time/i).type('01:00:00')
}
