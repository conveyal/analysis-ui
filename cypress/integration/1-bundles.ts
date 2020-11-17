import {findOrCreateRegion, scratchRegion} from './utils'

// Bundles may take awhile to upload
const processingTimeout = 240000

function createBundle(name: string, selectFilesFn: () => void) {
  cy.findByText(/Create a new network bundle/).click()
  cy.findByLabelText(/Bundle Name/i).type(name)

  selectFilesFn()

  cy.findByRole('button', {name: /Create/})
    .should('not.be.disabled')
    .click()
    .contains('Processing')
    .should('exist')
    .contains('Processing', {timeout: processingTimeout})
    .should('not.exist')
  cy.location('pathname').should('match', /\/bundles\/.{24}$/)
}

describe('Network bundles', () => {
  const region = findOrCreateRegion(scratchRegion.name, scratchRegion.bounds)

  beforeEach(() => {
    region.navTo()
    cy.navTo('network bundles')
  })

  const singleFeedBundle = region.findOrCreateBundle(
    'Temporary Single feed',
    scratchRegion.GTFSfile,
    scratchRegion.PBFfile
  )

  after(() => singleFeedBundle.delete())

  it('with single feed can be uploaded and deleted', function () {
    singleFeedBundle.navTo()

    // confirm that the bundle was saved
    cy.contains('or select an existing one')
    cy.location('pathname').should('match', /.*bundles\/.{24}$/)
    cy.findByLabelText(/Network bundle name/i)
      .invoke('val')
      .should('equal', singleFeedBundle.name)
    cy.findByLabelText(/Feed #1/)
      .invoke('val')
      .should('equal', scratchRegion.feedAgencyName)
    cy.findByLabelText(/Feed #2/).should('not.exist')
  })

  it('can reuse OSM and GTFS components', function () {
    const bundleName = Cypress.env('dataPrefix') + 'Reuse OSM and GTFS'
    createBundle(bundleName, () => {
      cy.findByText(/Reuse existing OpenStreetMap/i).click()
      cy.findByText(/network bundle to reuse OSM from/i)
        .parent()
        .select(singleFeedBundle.name)
      cy.findByText(/Reuse existing GTFS/i).click()
      cy.findByText(/network bundle to reuse GTFS from/i)
        .parent()
        .select(singleFeedBundle.name)
    })

    cy.findByLabelText(/Feed #1/)
      .invoke('val')
      .then((val) => {
        expect(val).to.eq(scratchRegion.feedAgencyName)
      })
    cy.findByText(/Delete this network bundle/i).click()
    cy.findByRole('alertdialog', {name: /Confirm/})
      .findByRole('button', {name: /Delete/})
      .click()
    cy.location('pathname').should('match', /.*\/bundles$/)
  })

  it('rejects obviously corrupt GTFS', function () {
    const bundleName = Cypress.env('dataPrefix') + 'Corrupt Bundle'

    cy.findByText(/Create a new network bundle/).click()
    cy.findByLabelText(/Bundle Name/i).type(bundleName)
    cy.findByText(/Reuse existing OpenStreetMap/i).click()
    cy.findByText(/network bundle to reuse OSM from/i)
      .parent()
      .select(singleFeedBundle.name)
    cy.findByText(/Upload new GTFS/i).click()
    cy.findByLabelText(/Select .*GTFS/i).attachFile({
      filePath: scratchRegion.corruptGTFSfile,
      encoding: 'base64',
      mimeType: 'application/octet-stream'
    })
    cy.findByRole('button', {name: /Create/i}).click()
    cy.findByText(/Wait until processing is complete/)
    cy.findByText(/error/i, {timeout: processingTimeout}).should(
      'have.attr',
      'role',
      'alert'
    )
    cy.navTo('network bundles')
    // TODO need semantic selector for dropdown
    cy.findByText('Select...').click().type('ERROR{enter}')
    cy.contains(bundleName)
    cy.findByRole('alert').contains(
      'Please upload valid OSM .pbf and GTFS .zip files.'
    )
    cy.findByRole('button', {name: /delete/i}).click()
    cy.findByRole('alertdialog', {name: /Confirm/})
      .findByRole('button', {name: /Delete/})
      .click()
  })

  it('with multiple GTFS feeds can be uploaded', function () {
    const bundleName = Cypress.env('dataPrefix') + 'Multiple GTFS'
    createBundle(bundleName, () => {
      cy.findByText(/Reuse existing OpenStreetMap/i).click()
      cy.findByText(/network bundle to reuse OSM from/i)
        .parent()
        .select(singleFeedBundle.name)
      cy.findByText(/Upload new GTFS/i).click()
      cy.findByLabelText(/Select .*GTFS/i)
        .attachFile({
          filePath: scratchRegion.GTFSfile,
          encoding: 'base64',
          mimeType: 'application/octet-stream'
        })
        .attachFile({
          filePath: scratchRegion.GTFSfile,
          encoding: 'base64',
          mimeType: 'application/octet-stream'
        })
    })

    cy.findByLabelText(/Feed #1/)
      .invoke('val')
      .then((name) => {
        expect(name).to.equal(scratchRegion.feedAgencyName)
      })
    cy.findByLabelText(/Feed #2/)
      .invoke('val')
      .then((name) => {
        expect(name).to.equal(scratchRegion.feedAgencyName)
      })
    cy.findByLabelText(/Feed #3/).should('not.exist')
    cy.findByText(/Delete this network bundle/i).click()
    cy.findByRole('alertdialog', {name: /Confirm/})
      .findByRole('button', {name: /Delete/})
      .click()
    cy.location('pathname').should('match', /.*\/bundles$/)
    cy.findByText(/Select.../).click()
    cy.contains(bundleName).should('not.exist')
  })
})
