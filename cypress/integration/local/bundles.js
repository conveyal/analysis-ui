context('Network bundles', () => {
  before('prepare the region', () => {
    cy.fixture('regions/scratch.json').as('region')
    cy.setupRegion('scratch')
  })

  it('with single feed can be uploaded and deleted', function () {
    let bundleName = 'temp bundle ' + Date.now()
    cy.findByTitle('Network Bundles').click({force: true})
    cy.findByText(/Create a new network bundle/).click()
    cy.location('pathname').should('match', /.*\/bundles\/create$/)
    cy.findByLabelText(/Bundle Name/i).type(bundleName)
    cy.findByText(/Upload new OpenStreetMap/i).click()
    cy.fixture(this.region.PBFfile, {encoding: 'base64'}).then(
      (fileContent) => {
        cy.findByLabelText(/Select PBF file/i).upload({
          encoding: 'base64',
          fileContent,
          fileName: this.region.PBFfile,
          mimeType: 'application/octet-stream'
        })
      }
    )
    cy.findByText(/Upload new GTFS/i).click()
    cy.fixture(this.region.GTFSfile, {encoding: 'base64'}).then(
      (fileContent) => {
        cy.findByLabelText(/Select .*GTFS/i).upload({
          encoding: 'base64',
          fileContent,
          fileName: this.region.GTFSfile,
          mimeType: 'application/octet-stream'
        })
      }
    )
    cy.findByRole('button', {name: /Create/i}).click()
    cy.findByText(/Processing/)
    cy.location('pathname', {timeout: 60000}).should(
      'match',
      /.*\/bundles\/.{24}$/
    )
    // confirm that the bundle was saved
    cy.contains('or select an existing one')
    cy.location('pathname').should('match', /.*bundles\/.{24}$/)
    cy.findByPlaceholderText(/Bundle name/i)
      .invoke('val')
      .then((name) => {
        expect(name).to.equal(bundleName)
      })
    cy.findByLabelText(/Feed #1/)
      .invoke('val')
      .then((name) => {
        expect(name).to.equal(this.region.feedAgencyName)
      })
    cy.findByLabelText(/Feed #2/).should('not.exist')
    cy.findByText(/Delete this network bundle/i).click()
    cy.findByRole('alertdialog', 'Confirm')
      .findByRole('button', {name: /Delete/})
      .click()
    cy.location('pathname').should('match', /.*\/bundles$/)
    cy.findByText(/Select.../).click()
    cy.contains(bundleName).should('not.exist')
  })
})
