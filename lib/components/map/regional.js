import React, { Component, PropTypes } from 'react'
import { ReactChoropleth } from '@conveyal/gridualizer'
import lonlat from '@conveyal/lonlat'
import colors from '../../constants/colors'

const NO_DATA = -Math.pow(2, 30)

/** A layer showing a proabilistic regional comparison */
export default class Regional extends Component {
  static propTypes = {
    baseGrid: PropTypes.object.isRequired,
    differenceGrid: PropTypes.object.isRequired,
    probabilityGrid: PropTypes.object.isRequired,
    minimumImprovementProbability: PropTypes.number,
    breaks: PropTypes.array.isRequired,
    id: PropTypes.string.isRequired,
    comparisonId: PropTypes.string
  }

  static defaultProps = {
    minimumImprovementProbability: 0.95 // https://xkcd.com/1478/
  }

  static contextTypes = {
    map: PropTypes.object.isRequired
  }

  componentDidMount () {
    // TODO clooge, handle click actions the way we handle map state
    // maybe just call onClick on every map component if it has an onClick function
    const {map} = this.context
    map.on('click', this.onMapClick)
  }

  componentWillUnmount () {
    const {isRegionalAnalysisSamplingDistributionComponentOnMap, removeRegionalAnalysisSamplingDistributionComponentFromMap} = this.props
    const {map} = this.context
    map.off('click', this.onMapClick)
    if (isRegionalAnalysisSamplingDistributionComponentOnMap) {
      // don't leave dest travel time distribution on map when exiting analysis mode
      removeRegionalAnalysisSamplingDistributionComponentFromMap()
    }
  }

  onMapClick = (e) => {
    const {id, comparisonId, setRegionalAnalysisOrigin, isRegionalAnalysisSamplingDistributionComponentOnMap} = this.props
    // if the destination component is already on the map, don't add it - change destination by
    // dragging destination marker
    if (!isRegionalAnalysisSamplingDistributionComponentOnMap) {
      setRegionalAnalysisOrigin({ regionalAnalysisId: id, comparisonRegionalAnalysisId: comparisonId, latlon: lonlat(e.latlng) })
    }
  }

  render () {
    const { baseGrid, comparisonId, differenceGrid, probabilityGrid, minimumImprovementProbability, breaks } = this.props

    if (comparisonId == null) {
      return <ReactChoropleth grid={baseGrid} breaks={breaks} colors={colors.REGIONAL_GRADIENT} />
    } else {
      // now, mask with probability; probability is put in grids as ints 0 - 100k
      const maskedGrid = mask(differenceGrid, probabilityGrid, minimumImprovementProbability * 1e5)

      return <ReactChoropleth
        grid={maskedGrid}
        colors={colors.REGIONAL_COMPARISON_GRADIENT}
        breaks={breaks}
        noDataValue={NO_DATA}
        />
    }
  }
}

// mask a grid, returning a new, masked grid
function mask (grid, probabilityGrid, cutoff) {
  const gridsDoNotAlign = grid.west !== probabilityGrid.west ||
    grid.north !== probabilityGrid.north ||
    grid.zoom !== probabilityGrid.zoom ||
    grid.width !== probabilityGrid.width ||
    grid.height !== probabilityGrid.height

  if (gridsDoNotAlign) {
    throw new Error('Grids do not align for masking')
  }

  const { north, west, zoom, width, height } = grid

  const newGrid = {
    north,
    west,
    zoom,
    width,
    height,
    data: new Int32Array(width * height),
    // start at zero not Infinity to avoid having to update min/max for cells where probability
    // is less than the cutoff
    min: 0,
    max: 0
  }

  for (let pixel = 0; pixel < width * height; pixel++) {
    if (probabilityGrid.data[pixel] < cutoff) newGrid.data[pixel] = 0
    else {
      newGrid.data[pixel] = grid.data[pixel]
      if (newGrid.min > grid.data[pixel]) newGrid.min = grid.data[pixel]
      if (newGrid.max < grid.data[pixel]) newGrid.max = grid.data[pixel]
    }
  }

  return newGrid
}
