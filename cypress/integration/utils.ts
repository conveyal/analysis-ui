import Bundle from '../models/bundle'
import Region from '../models/region'
import OpportunityData from '../models/opportunity-data'
import scratchRegion from '../fixtures/regions/scratch.json'

// Re-export the scratch data
export {default as scratchRegion} from '../fixtures/regions/scratch.json'

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

/**
 * Use the default region
 */
export function getDefaultSetup(): DefaultSetup {
  const region = findOrCreateRegion(scratchRegion.name, scratchRegion)
  const bundle = region.findOrCreateBundle(
    scratchRegion.feedAgencyName,
    scratchRegion.GTFSfile,
    scratchRegion.PBFfile
  )
  const opportunityData = region.findOrCreateOpportunityDataset(
    scratchRegion.opportunities.grid.name,
    scratchRegion.opportunities.grid.file
  )

  return {bundle, region, opportunityData}
}

/**
 * Find or create a new region.
 */
export function findOrCreateRegion(name: string, bounds: CL.Bounds): Region {
  const region = new Region(name)
  before(() => {
    cy.visit('/')
    cy.get('#LoadingSkeleton').should('not.exist')
    cy.get('button').then((buttons) => {
      const pb = buttons.filter((_, el) => el.textContent === region.name)
      if (pb.length === 0) {
        cy.createRegion(region.name, bounds)
      } else {
        cy.wrap(pb.first()).click()
        cy.navComplete()
      }
      cy.location('pathname').then((path) => {
        region.path = path
      })
    })
  })
  return region
}
