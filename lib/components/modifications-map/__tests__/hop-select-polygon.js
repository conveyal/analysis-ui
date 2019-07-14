import {wrapMapComponent, shallowSnapshot} from 'lib/utils/component'
import HopSelectPolygon from '../hop-select-polygon'

const props = {
  allStops: [],
  hopStops: [],
  selectHops: jest.fn()
}

shallowSnapshot(wrapMapComponent(HopSelectPolygon, props))
