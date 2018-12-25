// @flow
import type {Project} from '../types'

export default function cleanProjectScenarioName (
  project?: Project,
  scenarioIndex: number
): string {
  if (!project) { return 'Undefined' }
  const scenarioName = project.variants[scenarioIndex] || 'Baseline'
  const description = `${project.name}-${scenarioName}`
  return description.replace(/[^a-zA-Z0-9]/, '-')
}
