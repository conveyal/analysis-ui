// @flow
import type {Project} from '../types'

export default function cleanProjectScenarioName (
  project: Project,
  scenarioIndex: number
): string {
  const scenarioName = project.variants[scenarioIndex]
  const description = `${project.name}-${scenarioName}`
  return description.replace(/[^a-zA-Z0-9]/, '-')
}
