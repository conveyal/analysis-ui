describe('Opportunity Datasets', () => {
  before(() => {
    cy.setup('region')
  })

  beforeEach(() => {
    cy.fixture('regions/scratch.json').its('opportunities').as('opportunities')
    cy.navTo('Opportunity datasets')
    cy.get('div.leaflet-container').as('map')
  })

  context('can be imported', () => {
    it('from CSV', function () {
      let opportunity = this.opportunities.csv
      let oppName = Cypress.env('dataPrefix') + opportunity.name + '_temp'
      let expectedFieldCount = 1 + opportunity.numericFields.length
      cy.findByText(/Upload a new dataset/i).click()
      cy.location('pathname').should('match', /\/opportunities\/upload$/)
      cy.findByPlaceholderText(/^Opportunity dataset/i).type(oppName)
      cy.findByLabelText(/^Select opportunity dataset/i).attachFile(
        opportunity.file
      )
      cy.findByLabelText(/Latitude/).type(opportunity.latitudeField)
      cy.findByLabelText(/Longitude/).type(opportunity.longitudeField)
      cy.get('a.btn')
        .contains(/Upload/)
        .should('not.be.disabled')
        .click()
      cy.location('pathname').should('match', /opportunities$/)
      // find the message showing this upload is complete
      cy.contains(new RegExp(oppName + ' \\(DONE\\)'), {timeout: 10000})
        .parent()
        .parent()
        .as('notice')
      // check number of fields uploaded
      cy.get('@notice').contains(
        `Finished uploading ${expectedFieldCount} features`
      )
      // close the message
      cy.get('@notice').findByRole('button', /x/).click()
      // select in the dropdown
      cy.findByText(/Select\.\.\./)
        .click()
        .type(`${oppName}: ${opportunity.numericFields[0]} {enter}`)
      // look at the map
      //cy.waitForMapToLoad()
      //cy.get('@map').matchImageSnapshot('csv-' + opportunity.name)
      //
      cy.contains(/Delete entire dataset/i).click()
    })

    it('from shapefile', function () {
      let opportunity = this.opportunities.shapefile
      let oppName = Cypress.env('dataPrefix') + opportunity.name + '_temp'
      let expectedFieldCount = opportunity.numericFields.length
      cy.findByText(/Upload a new dataset/i).click()
      cy.location('pathname').should('match', /\/opportunities\/upload$/)
      cy.findByPlaceholderText(/^Opportunity dataset/i).type(oppName)
      cy.findByLabelText(/Select opportunity dataset/)
        .attachFile({filePath: opportunity.files[0], encoding: 'base64'})
        .attachFile({filePath: opportunity.files[1], encoding: 'base64'})
        .attachFile({filePath: opportunity.files[2], encoding: 'base64'})
        .attachFile({filePath: opportunity.files[3], encoding: 'base64'})
      cy.get('a.btn')
        .contains(/Upload/)
        .should('not.be.disabled')
        .click()
      cy.location('pathname').should('match', /opportunities$/)
      // find the message showing this upload is complete
      cy.contains(new RegExp(oppName + ' \\(DONE\\)'), {timeout: 30000})
        .parent()
        .parent()
        .as('notice')
      // check number of fields uploaded
      cy.get('@notice').contains(
        `Finished uploading ${expectedFieldCount} features`
      )
      // close the message
      cy.get('@notice').findByRole('button', /x/).click()
      // select in the dropdown
      cy.findByText(/Select\.\.\./)
        .click()
        .type(`${oppName}: ${opportunity.numericFields[0]} {enter}`)
      cy.contains(/Delete entire dataset/i).click()
    })

    it('from .grid', function () {
      let opportunity = this.opportunities.grid
      let oppName = Cypress.env('dataPrefix') + opportunity.name + '_temp'
      cy.findByText(/Upload a new dataset/i).click()
      cy.location('pathname').should('match', /\/opportunities\/upload$/)
      cy.findByPlaceholderText(/^Opportunity dataset/i).type(oppName)
      cy.findByLabelText(/Select opportunity dataset/).attachFile({
        filePath: opportunity.file,
        encoding: 'base64'
      })
      cy.get('a.btn')
        .contains(/Upload/)
        .should('not.be.disabled')
        .click()
      cy.location('pathname').should('match', /opportunities$/)
      // find the message showing this upload is complete
      cy.contains(new RegExp(oppName + ' \\(DONE\\)'), {timeout: 10000})
        .parent()
        .parent()
        .as('notice')
      // check number of fields uploaded
      cy.get('@notice').contains(/Finished uploading 1 feature/i)
      // close the message
      cy.get('@notice').findByRole('button', /x/).click()
      // select in the dropdown
      cy.findByText(/Select\.\.\./)
        .click()
        .type(`${oppName} {enter}`)
      cy.contains(/Delete entire dataset/i).click()
    })
  })

  context('can be downloaded', () => {
    before(() => {
      cy.setup('opportunities')
    })
    it('as .grid', function () {
      let opportunity = this.opportunities.grid
      // TODO should get the data via click, not hardcoded API url
      cy.findByText(/Select\.\.\./)
        .click()
        .type(`default{enter}`)
      cy.contains(/Download as \.grid/)
      cy.location('href')
        .should('match', /opportunityDatasetId=\w{24}$/)
        .then((href) => {
          let gridId = href.match(/\w{24}$/)[0]
          cy.request(
            `http://localhost:7070/api/opportunities/${gridId}/grid`
          ).then((response) => {
            cy.request(response.body.url).then((response) => {
              cy.readFile('cypress/fixtures/' + opportunity.file, 'utf8').then(
                (file) => {
                  expect(response.body).to.equal(file)
                }
              )
            })
          })
        })
    })

    it('as TIFF') // eslint-disable-line jest/no-disabled-tests
  })

  after(() => {
    // TODO check that everything imported by these tests has been deleted
    // can look for the '_temp' suffix
  })
})
