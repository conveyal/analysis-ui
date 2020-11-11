// Re-export the scratch data
export {default as scratchRegion} from '../fixtures/regions/scratch.json'

// All modification types
export const ModificationTypes: Cypress.ModificationType[] = [
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
]

// Setup modification function
type SetupModificationFn = {
  data?: Record<string, unknown>
  id?: string
  type: Cypress.ModificationType
}

const modificationPrefix = Cypress.env('dataPrefix') + 'MOD'
export function createModificationName(type: string, description = '') {
  return `${modificationPrefix}${type}${description}${Date.now()}`
}

// Default bundle name
const scratchRegionName: string = Cypress.env('region')
const defaultBundleName =
  Cypress.env('dataPrefix') + scratchRegionName + ' bundle'

/**
 * Sets up a project for modification testing. IDs must be unique within
 * the region.
 */
export function setupProject(
  projectId: string,
  bundleName: string = defaultBundleName
) {
  const projectName = Cypress.env('dataPrefix') + projectId

  before(() => {
    // Ensure region exists and we are on the region page.
    cy.setup('region')

    // Create a project if it does not exist.
    cy.get('button').then((buttons) => {
      const pb = buttons.filter((_, el) => el.textContent === projectName)
      if (pb.length === 0) {
        // If this project isn't set up, make sure the other entities are.
        cy.setup('bundle')
        cy.setup('opportunities')
        cy.navTo('projects')

        cy.findByText(/Create new Project/i).click()
        cy.findByLabelText(/Project name/).type(projectName)
        cy.findByLabelText(/Associated network bundle/i)
          .click({force: true})
          .type(bundleName + '{enter}')
        cy.findByText(/^Create$/).click()
      } else {
        cy.wrap(pb.first()).click()
      }
    })
  })

  // Helper to go to the project.
  function navToProject() {
    cy.navTo('projects')
    cy.findByRole('button', {name: new RegExp(projectName)}).click()
    cy.navComplete()
  }

  // Maintain unique modification ids
  const ids = new Set()

  // Helper for setting up modifications for this project.
  function setupModification({data, id, type}: SetupModificationFn) {
    const modificationName = Cypress.env('dataPrefix') + (id ?? type + ids.size)
    if (ids.has(modificationName)) {
      throw new Error('Modification id must be unique per project')
    } else {
      ids.add(modificationName)
    }

    before(() => {
      navToProject()
      // Create if it does not exist
      cy.findAllByRole('button').then((buttons) => {
        const pb = buttons.filter(
          (_, el) => el.textContent === modificationName
        )
        if (pb.length === 0) {
          cy.createModification(type, modificationName)
        } else {
          cy.wrap(pb.first()).click()
          cy.navComplete()
        }
        if (data) cy.editModificationJSON(data)
      })
    })

    // Helper to navigate to this modification
    function navToMod() {
      navToProject()
      cy.findByRole('button', {name: new RegExp(modificationName)}).click()
    }

    function deleteMod() {
      navToMod()
      cy.findByRole('button', {name: /Delete modification/}).click()
      cy.findByRole('button', {name: /Confirm: Delete modification/}).click()
      cy.navComplete()
    }

    return {
      delete: deleteMod,
      name: modificationName,
      navTo: navToMod
    }
  }

  // Helper for setting up a scenario in this project.
  function setupScenario(scenarioName) {
    navToProject()
    cy.findByRole('tab', {name: 'Scenarios'}).click()
    cy.get('#scenarios').then((el) => {
      // create named scenario if it doesn't already exist
      if (!el.text().includes(scenarioName)) {
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
          .type(scenarioName + '{enter}')
      }
    })
  }

  return {
    setupModification,
    setupScenario,
    name: projectName,
    navTo: navToProject
  }
}

/**
 * Sets up modification testing.
 * - `before`: creates bundle, project, opportunity data and clears all old modifications (for development)
 * @example
 * define('Modification test group', () => {
 *   beforeModificationTests()
 *   // do tests
 * })
 */
export function beforeModificationTests() {
  before(() => {
    cy.setup('analysis')
    cy.clearAllModifications()
  })
}

/**
 * Generate a name, create a modification and (conditionally) clean up after.
 * @example
 * define('Modification test group', () => {
 *   beforeModificationTests()
 *   const name = setupModification('Add Trip Pattern')
 *   it('Add trip pattern should exist', ...)
 * })
 */
export function setupModification(type: Cypress.ModificationType): string {
  const name = createModificationName(type)

  before(() => cy.createModification(type, name))

  return name
}

/**
 * Create a scenario in the scratch project.
 */
export function createScenario(name) {
  // open the scenarios tab
  cy.goToEntity('project')
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
}
