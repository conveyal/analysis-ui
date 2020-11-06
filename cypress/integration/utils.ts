// All modification types
export const ModificationTypes = [
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
] as const

const modificationPrefix = Cypress.env('dataPrefix') + 'MOD'
export function createModificationName(
  type: typeof ModificationTypes[number],
  description = ''
) {
  return `${modificationPrefix}${type}${description}${Date.now()}`
}
