describe('Modifications', () => {
  before(() => {
    cy.setupProject('scratch')
  })

  beforeEach(() => {
    cy.findByTitle(/Edit Modifications/).click({force: true})
    cy.location('pathname').should('match', /.*\/projects\/.{24}$/)
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
    cy.findByTitle(/Edit Modifications/).click({force: true})
    cy.location('pathname').should('match', /\/projects\/.{24}$/)
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

  it('saves Add Trip Pattern mod', () => {
    let modName = 'Add Trip ' + Date.now()
    cy.findByRole('link', {name: 'Create a modification'}).click()
    cy.findByLabelText(/Modification type/i).select('Add Trip Pattern')
    cy.findByLabelText(/Modification name/i).type(modName)
    cy.findByRole('link', {name: 'Create'}).click()
    cy.location('pathname').should('match', /.*\/modifications\/.{24}$/)
    // now editing the modification
    cy.contains(modName)
    cy.findByRole('link', {name: /Add description/}).click()
    cy.findByLabelText('Description').type('the description')
    // go back and see if this saved
    cy.findByTitle(/Edit Modifications/).click({force: true})
    cy.location('pathname').should('match', /\/projects\/.{24}$/)
    cy.contains(/Add Trip Pattern/)
      .parent()
      .contains(modName)
  })

  it('can be imported from shapefile, in theory', () => {
    cy.get('svg[data-icon="upload"]').click()
    cy.contains(/Route alignments from shapefile/)
    // TODO need better selectors
  })

  it('draw trip pattern on map', () => {
    let modName = Date.now() + ''
    cy.setupModification('scratch', 'Add Trip Pattern', modName)
    cy.findByText(/Edit route geometry/i)
      .click()
      .contains(/Stop editing/i)
    let routePoints = [
      [39.0664, -84.5721],
      [39.0432, -84.5422],
      [39.0724, -84.5236]
    ]
    cy.window()
      .its('LeafletMap')
      .then((map) => {
        // zoom to route to be drawn
        map.fitBounds(routePoints)
        cy.wait(1000)
        // click at the coordinates
        routePoints.forEach((point) => {
          let px = map.latLngToContainerPoint(point)
          cy.get('div.leaflet-container').click(px.x, px.y)
        })
      })
  })

  // TODO remove test, only created to show Feed and Route selection
  it('Can select a feed, route and pattern', () => {
    const modType = 'Adjust Speed'
    const modName = 'Mod Name'
    cy.findByRole('link', {name: 'Create a modification'}).click()
    cy.findByLabelText(/Modification type/i).select(modType)
    cy.findByLabelText(/Modification name/i).type(modName)
    cy.findByRole('link', {name: 'Create'}).click()

    cy.findByLabelText(/Select feed/)
      .click({force: true})
      .type('Northern Kentucky')
      .type('{enter}')

    cy.findByLabelText(/Select route/)
      .click({force: true})
      .type('Taylor Mill')
      .type('{enter}')
  })
})
