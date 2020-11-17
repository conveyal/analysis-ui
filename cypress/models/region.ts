import scratchRegion from '../fixtures/regions/scratch.json'

import Bundle from './bundle'
import Model from './model'
import OpportunityData from './opportunity-data'
import Project from './project'

type ProjectAnalysisSettings = {
  project: Project
  scenario?: string
  settings?: Record<string, unknown>
}

const setProjectScenario = (project: string, scenario: string) => {
  cy.findByLabelText(/^Project$/)
    .click({force: true})
    .type(`${project}{enter}`, {delay: 0})

  cy.findByLabelText(/^Scenario$/)
    .click({force: true})
    .type(`${scenario}{enter}`, {delay: 0})
}

export default class Region extends Model {
  defaultBundle: Bundle
  defaultOpportunityDataset: OpportunityData

  delete() {
    this.navTo()
    cy.navTo('region settings')
    // Delete region
    cy.findByText(/Delete this region/).click()
    cy.findByText(/Confirm: Delete this region/).click()
    return cy.findByRole('dialog').should('not.exist')
  }

  /**
   * Must be on the analysis page.
   */
  fetchAccessibilityComparison(
    coords: L.LatLngExpression,
    opportunityDataset?: OpportunityData
  ): Cypress.Chainable<[number, number]> {
    cy.setOrigin(coords)

    opportunityDataset ??= this.defaultOpportunityDataset
    cy.findByLabelText(/^Opportunity Dataset$/) // eslint-disable-line cypress/no-unnecessary-waiting
      .click({force: true})
      .type(`${opportunityDataset.name}{enter}`, {delay: 0})
      .wait(100)
    cy.findByLabelText(/^Opportunity Dataset$/).should('be.enabled')

    cy.fetchResults()

    return cy
      .findByLabelText('Opportunities within isochrone')
      .itsNumericText()
      .then(
        (o): Cypress.Chainable<[number, number]> => {
          return cy
            .findByLabelText('Opportunities within comparison isochrone')
            .itsNumericText()
            .then((c): [number, number] => [o, c])
        }
      )
  }

  findOrCreateBundle(
    name: string,
    gtfsFilePath: string,
    osmFilePath: string
  ): Bundle {
    const bundle = new Bundle(name)

    // Store as default if there is none.
    if (!this.defaultBundle) this.defaultBundle = bundle

    before(() => {
      this.navTo()

      // Check for the existing bundle. If it does not exist, create one.
      cy.navTo('network bundles')
      cy.findByLabelText(/or select an existing one/)
        .click({force: true})
        .type(bundle.name + '{enter}')
      cy.navComplete()
      cy.location('pathname').then((path) => {
        if (!path.match(/bundles\/\w{24}$/)) {
          // Does not exist, create the bundle
          cy.createBundle(bundle.name, gtfsFilePath, osmFilePath)
        }
        bundle.path = path
      })
    })

    return bundle
  }

  findOrCreateProject(name: string, bundle?: Bundle): Project {
    bundle ??= this.defaultBundle
    const project = new Project(name, bundle)

    before(() => {
      this.navTo()

      // Create a project if it does not exist.
      cy.navTo('projects')
      cy.get('button').then((buttons) => {
        const pb = buttons.filter((_, el) => el.textContent === project.name)
        if (pb.length === 0) {
          cy.findByText(/Create new Project/i).click()
          cy.findByLabelText(/Project name/).type(project.name)
          cy.findByLabelText(/Associated network bundle/i)
            .click({force: true})
            .type(bundle.name + '{enter}')
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

    return project
  }

  findOrCreateOpportunityDataset(
    name: string,
    filePath: string
  ): OpportunityData {
    const od = new OpportunityData(name)

    if (!this.defaultOpportunityDataset) this.defaultOpportunityDataset = od

    before(() => {
      this.navTo()

      // Check for the existing ods
      cy.navTo('opportunity datasets')
      cy.findByText(/Select\.\.\./)
        .click()
        .type(`${od.name} {enter}`)
      cy.navComplete()
      cy.location('href').then((href) => {
        if (!href.match(/.*DatasetId=\w{24}$/)) {
          cy.createOpportunityDataset(od.name, filePath)
          cy.location('href').then((href) => {
            od.path = href
          })
        } else {
          od.path = href
        }
      })
    })

    return od
  }

  navTo() {
    cy.location('pathname', {log: false}).then((path) => {
      if (!path.startsWith(this.path)) {
        cy.visit(this.path)
        cy.navComplete()
      }
    })
  }

  navToAnalysis() {
    cy.location('pathname', {log: false}).then((path) => {
      if (!path.startsWith(this.path + '/analysis')) {
        cy.visit(this.path + '/analysis')
        cy.navComplete()
      }
    })
  }

  /**
   * By default, compares the same project from
   * the default scenario to the baseline scenario.
   */
  setupAnalysis(
    primary: ProjectAnalysisSettings,
    comparison?: ProjectAnalysisSettings
  ) {
    this.navToAnalysis()

    const projectName = primary.project.name
    cy.getPrimaryAnalysisSettings().within(() => {
      const scenario = primary.scenario ?? 'default'
      setProjectScenario(projectName, scenario)
      cy.patchAnalysisJSON({
        date: scratchRegion.date // TODO get this from the project bundle
      })
      if (primary.settings) cy.patchAnalysisJSON(primary.settings)
    })

    cy.getComparisonAnalysisSettings().within(() => {
      const comparisonProjectName = comparison?.project?.name ?? projectName
      const scenario = comparison?.scenario ?? 'baseline'
      setProjectScenario(comparisonProjectName, scenario)
      if (comparison?.settings) {
        cy.findByLabelText('Identical request settings').uncheck({force: true})
        cy.patchAnalysisJSON(comparison.settings)
      }
    })
  }
}
