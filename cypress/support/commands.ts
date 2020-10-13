import '@testing-library/cypress/add-commands'
import 'cypress-file-upload'
import {addMatchImageSnapshotCommand} from 'cypress-image-snapshot/command'

import {connectToDatabase} from '../../lib/db/connect'

addMatchImageSnapshotCommand({
  failureThresholdType: 'percent',
  failureThreshold: 0.05 // allow up to a 5% image diff
})

// Persist the user cookie across sessions
Cypress.Cookies.defaults({
  preserve: ['a0:state', 'a0:session', 'a0:redirectTo', 'adminTempAccessGroup']
})

// Access the DB directly
Cypress.Commands.add('db', () => connectToDatabase())

const prefix = Cypress.env('dataPrefix')
const regionName = Cypress.env('region')
const regionFixture = `regions/${regionName}.json`
// used to store object UUIDs between tests to avoid needless ui interaction
export const pseudoFixturePath = `cypress/fixtures/regions/.${regionName}.json`
const unlog = {log: false}

// No spinner
Cypress.Commands.add('loadingComplete', () =>
  cy.waitUntil(() => Cypress.$('#sidebar-spinner').length === 0, {
    log: false,
    timeout: 15000
  })
)

// Wait until the page has finished loading
Cypress.Commands.add('navComplete', () => {
  Cypress.log({
    displayName: 'navComplete',
    message: 'waiting...'
  })
  return cy.waitUntil(() => Cypress.$('#sidebar-spinner').length === 0, {
    log: false,
    timeout: 15000
  })
})

// For easy use inside tests
let isLoaded = false
let pseudoFixture: Record<string, unknown> = {}
Cypress.Commands.add('getLocalFixture', () => {
  Cypress.log({
    displayName: 'readLocal',
    message: `From ${isLoaded ? 'memory' : pseudoFixturePath}`
  })
  if (isLoaded) return cy.wrap(pseudoFixture, unlog)

  cy.task('touch', pseudoFixturePath, unlog)
  return cy.readFile(pseudoFixturePath, unlog).then((data) => {
    isLoaded = true
    pseudoFixture = data
    return pseudoFixture
  })
})

Cypress.Commands.add('storeInLocalFixture', (key, val) => {
  pseudoFixture[key] = val
  return cy.writeFile(pseudoFixturePath, pseudoFixture, unlog)
})

// Check if a floating point number is within a certain tolerance
Cypress.Commands.add(
  'isWithin',
  {prevSubject: true},
  (f1: number, f2: number, tolerance = 0) => {
    Cypress.log({
      displayName: 'isWithin',
      message: `Math.abs(${f1} - ${f2}) <= ${tolerance}`
    })
    return cy.wrap(Math.abs(f1 - f2), unlog).should('be.lte', tolerance)
  }
)

// Get the numeric value of an input
Cypress.Commands.add('itsNumericValue', {prevSubject: true}, (subject) =>
  cy
    .wrap(subject, unlog)
    .invoke(unlog, 'val')
    .then((v: string) => {
      const value = Number(v?.replace(',', ''))
      Cypress.log({displayName: 'itsNumericValue', message: value})
      return value
    })
)

// Get the numeric text of an input
Cypress.Commands.add('itsNumericText', {prevSubject: true}, (subject) =>
  cy
    .wrap(subject, unlog)
    .invoke(unlog, 'text')
    .then((v: string) => {
      const value = Number(v?.replace(',', ''))
      Cypress.log({displayName: 'itsNumericText', message: value})
      return value
    })
)

/**
 * Navigate directly to the scratch entity
 */
function goToEntity(entity) {
  Cypress.log({
    displayName: 'goTo',
    message: entity
  })
  return cy.getLocalFixture().then((storedVals) => {
    // thing exists; navigate to it
    switch (entity) {
      case 'region':
        cy.visit(`/regions/${storedVals.regionId}`, unlog)
        return cy.navComplete()
      case 'bundle':
        cy.visit(
          `/regions/${storedVals.regionId}/bundles/${storedVals.bundleId}`,
          unlog
        )
        return cy.navComplete()
      case 'opportunities':
        cy.visit(`/regions/${storedVals.regionId}/opportunities`, unlog)
        return cy.navComplete()
      case 'project':
        cy.visit(
          `/regions/${storedVals.regionId}/projects/${storedVals.projectId}/modifications`,
          unlog
        )
        return cy.navComplete()
      case 'analysis':
        cy.visit(`/regions/${storedVals.regionId}/regional`, {
          log: false,
          qs: {
            analysisId: storedVals.analysisId
          }
        })
        return cy.navComplete()
    }
  })
}

// Recursive setup
Cypress.Commands.add('setup', (entity) =>
  setup(entity).then(() => goToEntity(entity))
)

/**
 *
 */
function setup(entity) {
  Cypress.log({
    displayName: 'setupLocal',
    message: `Finding ${entity}...`
  })
  return cy.getLocalFixture().then((storedVals) => {
    const idKey = entity + 'Id'
    if (idKey in storedVals) return Promise.resolve()
    // if the entity didn't already exist, recurse through all dependencies
    if (entity === 'region') return createNewRegion()
    if (entity === 'bundle')
      return setup('region').then(() => createNewBundle())
    if (entity === 'opportunities')
      setup('region').then(() => createNewOpportunities())
    if (entity === 'project')
      return setup('bundle').then(() => createNewProject())
    throw new Error(`Entity "${entity}" not yet implemented`)
  })
}

function createNewOpportunities() {
  Cypress.log({
    displayName: 'creating',
    message: 'opportunities'
  })
  return cy.fixture(regionFixture, unlog).then((region) => {
    const opportunity = region.opportunities.grid
    const oppName = `${prefix}default_opportunities`
    cy.navTo('opportunity datasets')
    cy.findByText(/Upload a new dataset/i).click()
    cy.findByLabelText(/Opportunity dataset name/i).type(oppName)
    cy.findByLabelText(/Select opportunity dataset/).attachFile({
      filePath: opportunity.file,
      encoding: 'base64'
    })
    cy.findByRole('button', {name: /Upload a new opportunity dataset/}).click()
    cy.navComplete()
    // find the message showing this upload is complete
    cy.contains(new RegExp(oppName + ' \\(DONE\\)'), {timeout: 5000})
      .parent()
      .parent()
      .as('notice')
    // check number of fields uploaded
    cy.get('@notice').contains(/Finished uploading 1 feature/i)
    // close the message
    cy.get('@notice').findByRole('button', {name: /Close/}).click()
    // now grab the ID
    cy.findByText(/Select\.\.\./)
      .click()
      .type(`${oppName} {enter}`)
    return cy
      .location('href')
      .should('match', /.*DatasetId=\w{24}$/)
      .then((href) =>
        cy.storeInLocalFixture('opportunitiesId', href.match(/\w{24}$/)[0])
      )
  })
}

function createNewRegion() {
  Cypress.log({
    displayName: 'creating',
    message: 'region'
  })
  cy.visit('/regions/create')
  cy.findByLabelText(/Region Name/).type(prefix + regionName, {delay: 0})
  cy.fixture(regionFixture).then((region) => {
    cy.findByLabelText(/North bound/)
      .clear()
      .type(region.north, {delay: 1})
    cy.findByLabelText(/South bound/)
      .clear()
      .type(region.south, {delay: 1})
    cy.findByLabelText(/West bound/)
      .clear()
      .type(region.west, {delay: 1})
    cy.findByLabelText(/East bound/)
      .clear()
      .type(region.east, {delay: 1})
  })
  cy.findByRole('button', {name: /Set up a new region/}).click()
  cy.findByRole('button', {name: /Creating region/}).should('not.exist')
  cy.navComplete()
  cy.contains(/Upload a new network bundle|create new project/i)
  // store the region UUID for later
  return cy
    .location('pathname')
    .should('match', /regions\/\w{24}$/)
    .then((path) =>
      cy.storeInLocalFixture('regionId', path.match(/\w{24}$/)[0])
    )
}

function createNewBundle() {
  Cypress.log({
    displayName: 'creating',
    message: 'bundle'
  })
  const bundleName = prefix + regionName + ' bundle'
  cy.navTo('network bundles')
  cy.findByText(/Create .* bundle/).click()
  cy.location('pathname').should('match', /\/bundles\/create$/)
  cy.findByLabelText(/Network bundle name/i).type(bundleName, {delay: 1})
  cy.findByText(/Upload new OpenStreetMap/i).click()
  cy.fixture(regionFixture).then((region) => {
    cy.findByLabelText(/Select PBF file/i).attachFile({
      filePath: region.PBFfile,
      encoding: 'base64',
      mimeType: 'application/octet-stream'
    })
    cy.findByText(/Upload new GTFS/i).click()
    cy.findByLabelText(/Select .*GTFS/i).attachFile({
      filePath: region.GTFSfile,
      encoding: 'base64',
      mimeType: 'application/octet-stream'
    })
  })
  cy.findByRole('button', {name: /Create/i}).click()
  cy.findByText(/Processing/)
  cy.findByText(/Processing/, {timeout: 30000}).should('not.exist')
  // go back and grab the UUID
  cy.navTo('network bundles')
  cy.findByLabelText(/or select an existing one/)
    .click({force: true})
    .type(bundleName + '{enter}')
  return cy
    .location('pathname')
    .should('match', /bundles\/\w{24}$/)
    .then((path) =>
      cy.storeInLocalFixture('bundleId', path.match(/\w{24}$/)[0])
    )
}

function createNewProject() {
  Cypress.log({
    displayName: 'creating',
    message: 'project'
  })
  const projectName = prefix + regionName + ' project'
  const bundleName = prefix + regionName + ' bundle'
  cy.navTo('projects')
  cy.findByText(/Create new Project/i).click()
  cy.findByLabelText(/Project name/).type(projectName)
  cy.findByLabelText(/Associated network bundle/i)
    .click({force: true})
    .type(bundleName + '{enter}')
  cy.findByText(/^Create$/).click()

  // store the projectId
  return cy
    .location('pathname', unlog)
    .should('match', /regions\/\w{24}\/projects\/\w{24}\/modifications$/) // wait until the location has changed
    .then((path) =>
      cy.storeInLocalFixture('projectId', path.match(/\w{24}/g)[1])
    )
}

Cypress.Commands.add('deleteProject', (projectName) => {
  cy.navTo('projects')
  cy.get('body').then((body) => {
    if (body.text().includes(projectName)) {
      cy.findByText(projectName).click()
      cy.get('svg[data-icon="cog"]').click()
      cy.findByText(/Delete project/i).click()
    } else {
      // no such project - nothing to delete
    }
  })
})

const getPanel = () => cy.contains('Scenarios').parent()
Cypress.Commands.add('deleteScenario', (scenarioName) => {
  // can be called when editing modifications
  cy.navTo('edit modifications')
  // open the scenario panel if it isn't already
  getPanel().then((panel) => {
    if (!panel.text().includes('Create a scenario')) {
      cy.wrap(panel).click()
    }
  })
  getPanel()
    .contains(scenarioName)
    .findByTitle(/Delete this scenario/)
    .click()
})

const navToPages = {
  regions: {
    lookFor: /Set up a new region/i,
    path: /\//
  },
  'region settings': {
    lookFor: /Delete this region/i,
    path: /\/regions\/[a-z0-9]+\/edit/
  },
  projects: {
    lookFor: /Create new Project|Upload a .* Bundle/i,
    path: /\/regions\/[a-z0-9]+/
  },
  'network bundles': {
    lookFor: /Create a new network bundle/i,
    path: /\/regions\/[a-z0-9]+\/bundles/
  },
  'opportunity datasets': {
    lookFor: /Upload a new dataset/i,
    path: /\/regions\/[a-z0-9]+\/opportunities*/
  },
  'edit modifications': {
    lookFor: /create a modification/i,
    path: /\/regions\/[a-z0-9]+\/projects*/
  },
  analyze: {
    lookFor: /Comparison Project/i,
    path: /\/regions\/[a-z0-9]+\/analysis*/
  },
  'regional analyses': {
    lookFor: /Regional Analyses/i,
    path: /\/regions\/[a-z0-9]+\/regional*/
  }
}

/**
 * Guidance taken from https://www.cypress.io/blog/2020/08/17/when-can-the-test-navigate/
 */
Cypress.Commands.add('navTo', (menuItemTitle) => {
  const title = menuItemTitle.toLowerCase()
  Cypress.log({displayName: 'navTo:start', message: title})
  // Ensure that any previous navigation is complete before attempting to navigate again
  cy.navComplete()
  // Navigate to a page using one of the main (leftmost) menu items
  // and wait until at least part of the page is loaded.
  const page = navToPages[title]
  // click the menu item
  cy.get('#sidebar', unlog)
    .findByRole('button', {name: RegExp(title, 'i')})
    .click(unlog)
  // Ensure the pathname has updated to the correct path
  cy.location('pathname', unlog).should('match', page.path, unlog)
  // check that page loads at least some content
  cy.contains(page.lookFor, {log: false, timeout: 8000}).should(
    'be.visible',
    unlog
  )
  // Ensure the spinner has stopped loading before continuing
  return cy
    .navComplete()
    .then(() => Cypress.log({displayName: 'navTo:complete', message: title}))
})

Cypress.Commands.add('clickMap', (coord) => {
  console.assert('lat' in coord && 'lon' in coord)
  cy.getLeafletMap().then((map) => {
    const pix = map.latLngToContainerPoint([coord.lat, coord.lon])
    cy.get('div.leaflet-container').click(pix.x, pix.y)
  })
})

Cypress.Commands.add('getLeafletMap', () => cy.window().its('LeafletMap'))

Cypress.Commands.add('waitForMapToLoad', () =>
  cy // eslint-disable-line
    .getLeafletMap()
    .its('_loaded')
    .should('be.true') // this just does not seem to work as expected. The wait remains necessary
    .wait(500)
)

Cypress.Commands.add(
  'mapCenteredOn',
  (latLonArray: [number, number], tolerance: number) =>
    cy
      .getLeafletMap()
      .then((map) =>
        cy
          .wrap(map.distance(map.getCenter(), latLonArray))
          .should('be.lessThan', tolerance)
      )
)

Cypress.Commands.add(
  'centerMapOn',
  (latLonArray: [number, number], zoom = 12) =>
    // centers map on a given lat/lon coordinate: [x,y]
    cy.getLeafletMap().then((map) => {
      map.setView(latLonArray, zoom)
      return map
    })
)

Cypress.Commands.add('login', function () {
  cy.getCookie('a0:state').then((cookie) => {
    // If the cookie already exists, skip the login
    if (cookie) return

    cy.visit('/')
    cy.findByLabelText('Email').type(Cypress.env('username'))
    cy.findByLabelText('Password').type(Cypress.env('password'))
    cy.findByRole('button', {name: 'Log In'}).click()

    // Should show the home page
    cy.findByText(new RegExp(Cypress.env('username')))
  })
})
