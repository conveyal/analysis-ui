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

const typeUsesFeed = new Set([
  'Adjust Dwell Time',
  'Adjust Speed',
  'Convert To Frequency',
  'Remove Stops',
  'Remove Trips',
  'Reroute'
])

// Setup modification function
type SetupModificationProps = {
  data?: Record<string, unknown>
  onCreate?: () => void
  id?: string
  type: Cypress.ModificationType
}

type TestModification = {
  delete: () => void
  name: string
  navTo: () => void
}

type SetupModification = (props: SetupModificationProps) => TestModification

type TestProject = {
  deleteModification: (name: string) => void
  setupModification: SetupModification
  setupScenarios: (scenarioNames: string[]) => void
  name: string
  navTo: () => void
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
 * Sets up a project for modification testing. Names must be unique within
 * the region.
 * TODO:
 * - Expand settings to allow using other regions and opportunities.
 * - Attach the "scratch" data associated to the project.
 * - Create a helper for running an analysis on this project.
 * - Move to a class based structure? new Region(), new Project(), etc.
 */
export function setupProject(
  projectName: string,
  bundleName: string = defaultBundleName
): TestProject {
  const project = {
    name: Cypress.env('dataPrefix') + projectName,
    path: null
  }

  before(() => {
    // Ensure region exists and we are on the region page.
    cy.setup('region')

    // Create a project if it does not exist.
    cy.get('button').then((buttons) => {
      const pb = buttons.filter((_, el) => el.textContent === project.name)
      if (pb.length === 0) {
        // If this project isn't set up, make sure the other entities are.
        cy.setup('bundle')
        cy.setup('opportunities')
        cy.navTo('projects')

        cy.findByText(/Create new Project/i).click()
        cy.findByLabelText(/Project name/).type(project.name)
        cy.findByLabelText(/Associated network bundle/i)
          .click({force: true})
          .type(bundleName + '{enter}')
        cy.findByText(/^Create$/).click()
      } else {
        cy.wrap(pb.first()).click()
      }
      cy.navComplete()

      // Store the project id
      cy.location('pathname').then((path) => {
        project.path = path
      })
    })
  })

  // Helper to go to the project.
  function navToProject() {
    cy.location('pathname').then((path) => {
      if (path === project.path) {
        cy.findByRole('tab', {name: /Modifications/}).click()
      } else {
        cy.visit(project.path)
        cy.navComplete()
      }
    })
  }

  // Maintain unique modification ids
  const ids = new Set()

  // Helper for setting up modifications for this project.
  function setupModification({
    data,
    onCreate,
    id,
    type
  }: SetupModificationProps): TestModification {
    const modification = {
      name: Cypress.env('dataPrefix') + (id ?? type + ids.size),
      path: null
    }
    if (ids.has(modification.name)) {
      throw new Error('Modification id must be unique per project')
    } else {
      ids.add(modification.name)
    }

    /**
     * const mod = new Modification({data, name, onCreate, project, type})
     * mod.before_setup() // sets .path
     * return mod
     *
     * Later...
     *   mod.name
     *   mod.navTo()
     *   mod.delete()
     */

    before(() => {
      navToProject()
      // Create if it does not exist
      cy.findAllByRole('button').then((buttons) => {
        const pb = buttons.filter(
          (_, el) => el.textContent === modification.name
        )
        if (pb.length === 0) {
          cy.createModification(type, modification.name)

          // Set the feed and route to the default
          if (typeUsesFeed.has(type)) {
            cy.selectDefaultFeedAndRoute()
          }

          if (onCreate) onCreate()
        } else {
          cy.wrap(pb.first()).click()
          cy.navComplete()
        }

        // On each test run ensure it starts with the same data.
        if (data) {
          cy.editModificationJSON(data)
        }

        // Store the modification path
        cy.location('pathname').then((path) => {
          modification.path = path
        })
      })
    })

    // Helper to navigate to this modification
    function navToMod() {
      cy.location('pathname').then((path) => {
        if (path !== modification.path) {
          navToProject()
          cy.findByRole('button', {name: new RegExp(modification.name)}).click()
          cy.navComplete()
        }
      })
    }

    function deleteMod() {
      navToMod()
      cy.findByRole('button', {name: /Delete modification/}).click()
      cy.findByRole('button', {name: /Confirm: Delete modification/}).click()
      cy.navComplete()
    }

    return {
      delete: deleteMod,
      name: modification.name,
      navTo: navToMod
    }
  }

  // Helper for setting up a scenarios in this project.
  function setupScenarios(scenarios: string[]) {
    before(() => {
      navToProject()
      cy.findByRole('tab', {name: 'Scenarios'}).click()
      scenarios.forEach((scenarioName) => {
        cy.get('#scenarios').then((el) => {
          // create named scenario if it doesn't already exist
          if (!el.text().includes(scenarioName)) {
            cy.findByRole('button', {name: 'Create a scenario'}).click()
            cy.wait(10) // eslint-disable-line
            // TODO there has GOT to be a better way...
            cy.get('#scenarios').findAllByRole('group').last().click()

            cy.focused()
              .clear()
              .type(scenarioName + '{enter}')
          }
        })
      })
    })
  }

  // Helper for cleaning up modifications by name
  function deleteModification(modificationName: string) {
    navToProject()
    // Create if it does not exist
    cy.findAllByRole('button').then((buttons) => {
      const pb = buttons.filter((_, el) => el.textContent === modificationName)
      if (pb.length !== 0) {
        cy.wrap(pb.first()).click()
        cy.findByRole('button', {name: /Delete modification/}).click()
        cy.findByRole('button', {name: /Confirm: Delete modification/}).click()
        cy.navComplete()
      }
    })
  }

  return {
    deleteModification,
    setupModification,
    setupScenarios,
    name: project.name,
    navTo: navToProject
  }
}
