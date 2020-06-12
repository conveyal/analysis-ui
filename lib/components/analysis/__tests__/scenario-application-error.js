import {testAndSnapshot} from 'lib/utils/component'
import {mockScenarioApplicationError} from 'lib/utils/mock-data'

import ScenarioApplicationError from '../scenario-application-error'

testAndSnapshot(ScenarioApplicationError, {error: mockScenarioApplicationError})
