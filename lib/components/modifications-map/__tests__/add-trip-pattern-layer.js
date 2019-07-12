import {wrapMapComponent, shallowSnapshot} from 'lib/utils/component'
import {mockSegment} from 'lib/utils/mock-data'

import AddTripPatternLayer from '../add-trip-pattern-layer'

const props = {
  bidirectional: false,
  segments: [mockSegment]
}

shallowSnapshot(wrapMapComponent(AddTripPatternLayer, props))
