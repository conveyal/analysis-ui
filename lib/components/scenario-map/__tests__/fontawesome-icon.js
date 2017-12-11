// @flow

import FontawesomeIcon from '../fontawesome-icon'

describe('Scenario-Map > FontawesomeIcon', () => {
  it('renders correctly', () => {
    expect(FontawesomeIcon({
      color: '#fff',
      icon: 'pencil'
    })).toMatchSnapshot()
  })
})
