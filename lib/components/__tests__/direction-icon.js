/* global describe, expect, it */

describe('Component > DirectionIcon', () => {
  const renderer = require('react-test-renderer')
  const React = require('react')
  const {Map} = require('react-leaflet')
  const DirectionIcon = require('../direction-icon')

  it('renders correctly', () => {
    const tree = renderer.create(
      <Map>
        <DirectionIcon
          bearing={123}
          clickable
          color='blue'
          coordinates={[12, 34]}
          iconSize={20}
          />
      </Map>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
