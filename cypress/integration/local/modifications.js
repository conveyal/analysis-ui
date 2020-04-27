describe('Modifications', () => {
  before(() => {
    cy.setupProject('scratch')
  })

  beforeEach(() => {
    cy.fixture('regions/scratch.json').as('region')
    cy.navTo(/Edit Modifications/)
  })

  it('can be created, saved, and deleted', () => {
    // create an arbitrary modification type
    // these actions should be the same across all types
    // TODO the types that are commented out are producing errors locally
    let mods = [
      'Add Trip Pattern',
      //'Adjust Dwell Time',
      'Adjust Speed',
      //'Convert To Frequency',
      //'Remove Stops',
      'Remove Trips',
      'Reroute',
      'Custom'
    ]
    let modType = mods[Math.floor(Math.random() * mods.length)]
    let modName = 'tempMod ' + Date.now()
    cy.findByRole('link', {name: 'Create a modification'}).click()
    cy.findByLabelText(/Modification type/i).select(modType)
    cy.findByLabelText(/Modification name/i).type(modName)
    cy.findByRole('link', {name: 'Create'}).click()
    cy.location('pathname').should('match', /.*\/modifications\/.{24}$/)
    cy.contains(modName)
    cy.findByRole('link', {name: /Add description/}).click()
    cy.findByLabelText('Description').type('descriptive text')
    // go back and see if it saved
    cy.navTo(/Edit Modifications/)
    // TODO needs to be conditional in case the list is collapsed
    cy.contains(modType).parent().contains(modName).click()
    cy.location('pathname').should('match', /.*\/modifications\/.{24}$/)
    cy.contains(modName)
    cy.findByLabelText('Description').contains('descriptive text')
    // delete it
    cy.get('a[name="Delete modification"]').click()
    cy.location('pathname').should('match', /.*\/projects\/.{24}$/)
    cy.contains('Create a modification')
    cy.findByText(modName).should('not.exist')
  })

  context('new trip patterns', () => {
    it('can be imported from shapefile, in theory', () => {
      cy.get('svg[data-icon="upload"]').click()
      cy.contains(/Route alignments from shapefile/)
      // TODO need better selectors
    })

    it('can be drawn on map', function () {
      let modName = Date.now() + ''
      cy.setupModification('scratch', 'Add Trip Pattern', modName)
      cy.findByText(/Edit route geometry/i)
        .click()
        .contains(/Stop editing/i)
      cy.get('div.leaflet-container').as('map')
      cy.window().then((win) => {
        let map = win.LeafletMap
        let L = win.L
        let route = L.polyline(this.region.newRoute)
        // TODO fitbounds seems to mess up the lat/lon -> pix projections
        //route.addTo(map)
        //map.fitBounds( route.getBounds() )
        // click at the coordinates
        route.getLatLngs().forEach((point) => {
          let pix = map.latLngToContainerPoint(point)
          cy.get('@map').click(pix.x, pix.y)
        })
      })
      cy.findByText(/Stop editing/i)
        .click()
        .contains(/Edit route geometry/i)
      cy.get('a[name="Delete modification"]').click()
    })

    it('can create and reuse timetables', function () {
      let modName = 'timetable templates'
      cy.setupModification('scratch', 'Add Trip Pattern', modName)
      cy.findByText(/Add new timetable/).click()
      cy.findByText(/Timetable 1/).click()
      cy.get('input[name="Name"]').clear().type('Weekday')
      cy.findByLabelText(/Mon/).check()
      cy.findByLabelText(/Tue/).check()
      cy.findByLabelText(/Wed/).check()
      cy.findByLabelText(/Thu/).check()
      cy.findByLabelText(/Fri/).check()
      cy.findByLabelText(/Sat/).uncheck()
      cy.findByLabelText(/Sun/).uncheck()
      // TODO these selectors not working
      //cy.findByLabelText(/Frequency/).clear().type('00:20:00')
      //cy.findByLabelText(/Start time/).clear().type('06:00')
      //cy.findByLabelText(/End time/).clear().type('23:00')
      //cy.findByLabelText(/dwell time/).clear().type('00:30:00')
      // exit and create new mod to copy into
      cy.setupModification('scratch', 'Add Trip Pattern', 'temp')
      cy.findByText(/Copy existing timetable/).click()
      cy.findByRole('dialog').as('dialog')
      cy.get('@dialog')
        .findByLabelText(/Region/)
        .select('scratch')
      cy.get('@dialog')
        .findByLabelText(/Project/)
        .select('scratch project')
      cy.get('@dialog')
        .findByLabelText(/Modification/)
        .select(modName)
      cy.get('@dialog')
        .findByLabelText(/Timetable/)
        .select('Weekday')
      cy.findByText(/Copy into new timetable/i).click()
      cy.contains(/copy of Weekday/i).click()
      // verify the settings from above
      cy.findByLabelText(/Mon/).should('be.checked')
      cy.findByLabelText(/Tue/).should('be.checked')
      cy.findByLabelText(/Wed/).should('be.checked')
      cy.findByLabelText(/Thu/).should('be.checked')
      cy.findByLabelText(/Fri/).should('be.checked')
      cy.findByLabelText(/Sat/).should('not.be.checked')
      cy.findByLabelText(/Sun/).should('not.be.checked')
      // delete the temp modification
      cy.get('a[name="Delete modification"]').click()
      // delete the template modification
      cy.findByText(modName).click()
      cy.get('a[name="Delete modification"]').click()
    })
  })

  context('Adjust speed', () => {
    it('can select a feed & route', () => {
      let modName = Date.now() + ''
      cy.setupModification('scratch', 'Adjust Speed', modName)
      cy.findByLabelText(/Select feed/)
        .click({force: true})
        .type('Northern Kentucky{enter}')
      cy.findByLabelText(/Select route/)
        .click({force: true})
        .type('Taylor Mill{enter}')
      cy.findByLabelText(/Select patterns/i)
      // TODO select a pattern

      cy.get('a[name="Delete modification"]').click()
    })
  })
})
