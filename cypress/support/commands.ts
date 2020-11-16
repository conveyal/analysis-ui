import scratchRegion from '../fixtures/regions/scratch.json'

const prefix: string = Cypress.env('dataPrefix')
const regionName: string = Cypress.env('region')
const localFixturePath: string = Cypress.env('localFixturePath')
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
let localFixture: Record<string, unknown> = {}
Cypress.Commands.add('getLocalFixture', () => {
  if (isLoaded) {
    Cypress.log({
      consoleProps: () => localFixture,
      displayName: 'readLocal',
      message: 'From memory'
    })
    return cy.wrap(localFixture, unlog)
  }

  cy.task('ensureExists', localFixturePath, unlog)
  return cy.readFile(localFixturePath, unlog).then((data) => {
    isLoaded = true
    localFixture = data
    Cypress.log({
      consoleProps: () => localFixture,
      displayName: 'readLocal',
      message: 'From storage'
    })
    return localFixture
  })
})

Cypress.Commands.add('storeInLocalFixture', (key, val) => {
  localFixture[key] = val
  return cy.writeFile(localFixturePath, localFixture, unlog)
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
Cypress.Commands.add('goToEntity', (entity: Cypress.Entity) => {
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
        cy.visit(`/regions/${storedVals.regionId}/analysis`, unlog)
        return cy.navComplete()
      case 'regionalAnalysis':
        cy.visit(
          `/regions/${storedVals.regionId}/regional?analysisId=${storedVals.regionalAnalysisId}`
        )
        return cy.navComplete()
    }
  })
})

// Recursive setup
Cypress.Commands.add('setup', (entity: Cypress.Entity) => {
  cy._setup(entity)
  return cy.goToEntity(entity)
})

Cypress.Commands.add('_setup', (entity: Cypress.Entity) => {
  Cypress.log({
    displayName: 'setupLocal',
    message: `Finding ${entity}...`
  })
  return cy.getLocalFixture().then((storedVals) => {
    const idKey = entity + 'Id'
    if (idKey in storedVals) return Promise.resolve()
    // if the entity didn't already exist, recurse through all dependencies
    switch (entity) {
      case 'region':
        return createNewRegion()
      case 'bundle':
        return cy._setup('region').then(() => createNewBundle())
      case 'opportunities':
        return cy._setup('region').then(() => createNewOpportunities())
      case 'project':
        return cy._setup('bundle').then(() => createNewProject())
      case 'analysis':
        cy._setup('project')
        return cy._setup('opportunities')
      case 'regionalAnalysis':
        cy._setup('project')
        cy._setup('opportunities')
        return createNewRegionalAnalysis()
      default:
        throw new Error(`Entity "${entity}" not yet implemented`)
    }
  })
})

function createNewOpportunities() {
  const opportunity = scratchRegion.opportunities.grid
  const oppName = `${prefix}default_opportunities`
  cy.goToEntity('opportunities')
  return cy
    .createOpportunityDataset(oppName, opportunity.file)
    .then((id) => cy.storeInLocalFixture('opportunitiesId', id))
}

function createNewRegion() {
  cy.createRegion(prefix + regionName, scratchRegion).then((id) => {
    cy.writeFile(localFixturePath, '{}') // Reset all other data
    cy.storeInLocalFixture('regionId', id)
  })
}

function createNewBundle() {
  cy.goToEntity('region')
  const bundleName = prefix + regionName + ' bundle'
  return cy
    .createBundle(bundleName, scratchRegion.GTFSfile, scratchRegion.PBFfile)
    .then((id) => {
      cy.storeInLocalFixture('bundleId', id)
    })
}

function createNewProject() {
  Cypress.log({
    displayName: 'creating',
    message: 'project'
  })
  const projectName = prefix + regionName + ' project'
  const bundleName = prefix + regionName + ' bundle'
  cy.goToEntity('region')
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

function createNewRegionalAnalysis() {
  Cypress.log({
    displayName: 'creating',
    message: 'regional analysis'
  })
  cy.setupAnalysis()
  cy.get('div#PrimaryAnalysisSettings').as('primary')
  cy.get('div#ComparisonAnalysisSettings').as('comparison')

  const analysisName = prefix + regionName + '_regional'
  cy.editPrimaryAnalysisJSON('bounds', scratchRegion.customRegionSubset)
  cy.fetchResults()
  // start the analysis
  cy.get('@primary')
    .findByRole('button', {name: 'Regional analysis'})
    .should('be.enabled')
    .click()

  cy.findByLabelText(/Regional analysis name/).type(analysisName, {delay: 0})

  cy.findByLabelText(/Opportunity dataset\(s\)/)
    .click({force: true})
    .type('people{enter}')

  cy.findByRole('button', {name: /Create/}).click()
  cy.findByRole('dialog').should('not.exist')

  // we should now be on the regional analyses page
  cy.findByRole('heading', {name: /Regional Analyses/i, timeout: 15000})
  cy.findByRole('heading', {name: analysisName})
    .parent()
    .parent()
    .as('statusBox')
  // shows progress
  cy.get('@statusBox').findByText(/\d+ \/ \d+ origins/)
  cy.findByRole('heading', {name: analysisName, timeout: 240000}).should(
    'not.exist'
  )
  cy.findByText(/View a regional analysis/)
    .click()
    .type(`${analysisName}{enter}`)
  cy.navComplete()

  // store the regionalAnalysisId
  return cy
    .location('href', unlog)
    .should('match', /regions\/\w{24}\/regional\?analysisId=\w{24}$/)
    .then((path) =>
      cy.storeInLocalFixture('regionalAnalysisId', path.match(/\w{24}/g)[1])
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
  cy.contains(page.lookFor, {timeout: 8000}).should('be.visible')
  // Ensure the spinner has stopped loading before continuing
  return cy
    .navComplete()
    .then(() => Cypress.log({displayName: 'navTo:complete', message: title}))
})

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
