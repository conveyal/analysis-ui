import {testAndSnapshot} from 'lib/utils/component'
import {mockRegion} from 'lib/utils/mock-data'

import SelectRegion from '../select-region'

testAndSnapshot(SelectRegion, {regions: [mockRegion]})
