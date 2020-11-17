import Bundle from '../models/bundle'
import Region from '../models/region'
import OpportunityData from '../models/opportunity-data'
import scratchRegion from '../fixtures/regions/scratch.json'

// Re-export the scratch data
export {default as scratchRegion} from '../fixtures/regions/scratch.json'
export {default as scratchResults} from '../fixtures/regions/scratch-results.json'

// Prefix each name with a value for easy database queries later
export const prefixName = (name: string): string =>
  Cypress.env('dataPrefix') + name

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

type DefaultSetup = {
  region: Region
  bundle: Bundle
  opportunityData: OpportunityData
}

// Store the default bundle/region/opportunity data
let defaultSetup: false | DefaultSetup = false

/**
 * Use the default region
 */
export function getDefaultSetup(): DefaultSetup {
  if (defaultSetup !== false) return defaultSetup
  const region = findOrCreateRegion(scratchRegion.name, scratchRegion.bounds)
  const bundle = region.findOrCreateBundle(
    scratchRegion.feedAgencyName,
    scratchRegion.GTFSfile,
    scratchRegion.PBFfile
  )
  const opportunityData = region.findOrCreateOpportunityDataset(
    scratchRegion.opportunities.grid.name,
    scratchRegion.opportunities.grid.file
  )
  defaultSetup = {bundle, region, opportunityData}

  return defaultSetup
}

/**
 * Find or create a new region.
 */
export function findOrCreateRegion(name: string, bounds: CL.Bounds): Region {
  const region = new Region(name)
  before('findOrCreateRegion', () => {
    cy.visit('/')
    cy.get('#LoadingSkeleton').should('not.exist')
    cy.get('button').then((buttons) => {
      const pb = buttons.filter((_, el) => el.textContent === region.name)
      if (pb.length === 0) {
        cy.createRegion(region.name, bounds)
      } else {
        cy.wrap(pb.first()).click()
        cy.location('pathname').should('match', /regions\/\w{24}$/)
        cy.navComplete()
      }
      cy.location('pathname').then((path) => {
        region.path = path
      })
    })
  })
  return region
}
