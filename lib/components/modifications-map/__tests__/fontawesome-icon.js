// @flow

import FontawesomeIcon from '../fontawesome-icon'

describe('Project-Map > FontawesomeIcon', () => {
  it('renders correctly', () => {
    expect(FontawesomeIcon({
      color: '#fff',
      icon: 'pencil'
    })).toMatchSnapshot()
  })
})
