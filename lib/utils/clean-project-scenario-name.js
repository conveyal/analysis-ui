//
import message from 'lib/message'

import {UNDEFINED_PROJECT_NAME} from '../constants'

export default function cleanProjectScenarioName(project, scenarioIndex) {
  if (!project) {
    return UNDEFINED_PROJECT_NAME
  }
  const scenarioName =
    project.variants[scenarioIndex] || message('variant.baseline')
  const description = `${project.name}-${scenarioName}`
  return description.replace(/[^a-zA-Z0-9]/, '-')
}
