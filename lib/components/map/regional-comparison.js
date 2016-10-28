import React, { Component, PropTypes } from 'react'
import { Choropleth, ReactChoropleth } from '@conveyal/gridualizer'
import dbg from 'debug'

const debug = dbg('scenario-editor:regional-comparison-layer')

/** A layer showing a proabilistic regional comparison */
export default class RegionalComparison extends Component {
  static propTypes = {
    baseGrid: PropTypes.object.isRequired,
    scenarioGrid: PropTypes.object.isRequired,
    probabilityGrid: PropTypes.object.isRequired,
    minimumImprovementProbability: PropTypes.number
  }

  static defaultProps = {
    minimumImprovementProbability: 0.95 // https://xkcd.com/1478/
  }

  render () {
    const { scenarioGrid, probabilityGrid, baseGrid, minimumImprovementProbability } = this.props
    // e pluribus unum
    // merge the grids to one
    // first, subtract baseline from scenario
    const mergedGrid = subtract(scenarioGrid, baseGrid)

    // compute breaks before masking so changing cutoff does not change scale
    // TODO bimodal classifier
    const breaks = Choropleth.quantile({ noDataValue: 0 })(mergedGrid, 5)

    // now, mask with probability; probability is put in grids as ints 0 - 100k
    mask(mergedGrid, probabilityGrid, minimumImprovementProbability * 1e5)

    return <ReactChoropleth
      grid={mergedGrid}
      colors={['#d7191c', '#fdae61', '#ffffbf', '#abd9e9', '#2c7bb6']}
      breaks={breaks}
      />
  }
}

/** non-destructively subtract grid B from grid A */
function subtract (a, b) {
  const gridsDoNotAlign = a.west !== b.west ||
    a.north !== b.north ||
    a.zoom !== b.zoom ||
    a.width !== b.width ||
    a.height !== b.height

  if (gridsDoNotAlign) {
    throw new Error('Grids do not align for subtraction')
  }

  const { north, west, zoom, width, height } = a

  const newGrid = {
    north,
    west,
    zoom,
    width,
    height,
    data: new Int32Array(width * height)
  }

  for (let pixel = 0; pixel < width * height; pixel++) {
    newGrid.data[pixel] = a.data[pixel] - b.data[pixel]
  }

  return newGrid
}

// mask a grid in place, setting the value to 0 wherever the value of probabilityGrid is less than cutoff
function mask (grid, probabilityGrid, cutoff) {
  const gridsDoNotAlign = grid.west !== probabilityGrid.west ||
    grid.north !== probabilityGrid.north ||
    grid.zoom !== probabilityGrid.zoom ||
    grid.width !== probabilityGrid.width ||
    grid.height !== probabilityGrid.height

  if (gridsDoNotAlign) {
    throw new Error('Grids do not align for masking')
  }

  const { width, height } = grid

  let unmasked = 0

  for (let pixel = 0; pixel < width * height; pixel++) {
    if (probabilityGrid.data[pixel] < cutoff) grid.data[pixel] = 0
    else unmasked++
  }

  debug(`${unmasked} pixels left unmasked`)
}
