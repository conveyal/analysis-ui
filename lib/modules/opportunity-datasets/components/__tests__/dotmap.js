import {testComponent} from 'lib/utils/test'

import Dotmap from '../dotmap'

test('dotmap should render without throwing an error', () => {
  testComponent(Dotmap).shallow()
})
