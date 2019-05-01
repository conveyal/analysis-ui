// @flow
import message from 'lib/message'

import type {Project} from '../types'
import {UNDEFINED_PROJECT_NAME} from '../constants'

export default function cleanProjectScenarioName(
  project?: Project,
  scenarioIndex: number
): string {
  if (!project) {
    return UNDEFINED_PROJECT_NAME
  }
  const scenarioName =
    project.variants[scenarioIndex] || message('variant.baseline')
  const description = `${project.name}-${scenarioName}`
  return description.replace(/[^a-zA-Z0-9]/, '-')
}
