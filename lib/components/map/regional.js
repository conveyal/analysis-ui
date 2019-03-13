// @flow
import lonlat from '@conveyal/lonlat'
import {MouseEvent} from 'leaflet'
import React, {Component} from 'react'
import {withLeaflet} from 'react-leaflet'

import colors from '../../constants/colors'
import type {Grid} from '../../types'

import Gridualizer from './gridualizer'

const NO_DATA = -Math.pow(2, 30)

type Props = {
  _id: string,
  baseGrid: Grid,
  breaks: number[],
  comparisonId: string,
  differenceGrid: Grid,
  isRegionalAnalysisSamplingDistributionComponentOnMap: boolean,
  removeRegionalAnalysisSamplingDistributionComponentFromMap: () => void,
  setRegionalAnalysisOrigin: Object => void
}

/**
 * A layer showing a proabilistic regional comparison
 */
class Regional extends Component {
  props: Props

  componentDidMount () {
    const {map} = this.props.leaflet
    map.on('click', this.onMapClick)
  }

  componentWillUnmount () {
    const {map} = this.props.leaflet
    map.off('click', this.onMapClick)
  }

  onMapClick = (e: MouseEvent) => {
    const {
      _id,
      comparisonId,
      setRegionalAnalysisOrigin,
      isRegionalAnalysisSamplingDistributionComponentOnMap
    } = this.props
    // if the destination component is already on the map, don't add it - change
    // destination by dragging destination marker
    if (!isRegionalAnalysisSamplingDistributionComponentOnMap) {
      setRegionalAnalysisOrigin({
        regionalAnalysisId: _id,
        comparisonRegionalAnalysisId: comparisonId,
        lonlat: lonlat(e.latlng)
      })
    }
  }

  render () {
    const {
      baseGrid,
      comparisonId,
      differenceGrid,
      breaks
    } = this.props

    if (!breaks || breaks.length === 0) {
      return <span /> // TODO do this one level higher
    } else if (comparisonId == null) {
      return (
        <Gridualizer
          breaks={breaks}
          colors={colors.REGIONAL_GRADIENT}
          grid={baseGrid}
        />
      )
    } else {
      // used to call mask() here

      return (
        <Gridualizer
          grid={differenceGrid}
          colors={colors.REGIONAL_COMPARISON_GRADIENT}
          breaks={breaks}
          noDataValue={NO_DATA}
        />
      )
    }
  }
}

// Add leaflet to props
export default withLeaflet(Regional)
