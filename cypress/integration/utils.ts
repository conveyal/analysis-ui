import Region from '../models/region'
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

// Store the default region
let defaultRegion: null | Region = null

/**
 * Use the default region
 */
export function getDefaultRegion(): Region {
  if (defaultRegion) return defaultRegion
  defaultRegion = getRegion(scratchRegion.name, scratchRegion.bounds)

  // Create a default bundle
  defaultRegion.getBundle(
    scratchRegion.feedAgencyName,
    scratchRegion.GTFSfile,
    scratchRegion.PBFfile
  )

  // Create a default opportunity dataset
  defaultRegion.getOpportunityDataset(
    scratchRegion.opportunities.grid.name,
    scratchRegion.opportunities.grid.file
  )

  // Create a default project
  defaultRegion.getProject('Default Test Project')

  return defaultRegion
}

/**
 * Find or create a new region.
 * TODO Preserve created data between tests with Cookies: https://docs.cypress.io/faq/questions/using-cypress-faq.html#How-do-I-preserve-cookies-localStorage-in-between-my-tests
 */
export function getRegion(name: string, bounds: CL.Bounds): Region {
  const region = new Region(name, bounds)
  before('getRegion', () => {
    region.initialize()
  })
  return region
}

/**
 * Clear temporary data used for speeding up test development
 */
export function clearTemporaryData() {
  Region.clearAllStoredPaths()
}
