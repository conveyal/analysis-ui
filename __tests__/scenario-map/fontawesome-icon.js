/* global describe, it, expect */

import FontawesomeIcon from '../../lib/scenario-map/fontawesome-icon'

describe('Scenario-Map > FontawesomeIcon', () => {
  it('renders correctly', () => {
    expect(FontawesomeIcon({ icon: 'pencil' })).toMatchSnapshot()
  })
})
