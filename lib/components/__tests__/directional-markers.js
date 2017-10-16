/* global describe, expect, it */

describe('Component > DirectionalMarkers', () => {
  const renderer = require('react-test-renderer')
  const React = require('react')
  const {Map} = require('react-leaflet')
  const DirectionalMarkers = require('../directional-markers')

  it('renders correctly', () => {
    expect(
      renderer
        .create(
          <Map>
            <DirectionalMarkers />
          </Map>
        )
        .toJSON()
    ).toMatchSnapshot()
  })
})
