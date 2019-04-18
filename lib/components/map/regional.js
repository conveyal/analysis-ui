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
    this.props.leaflet.map.on('click', this.onMapClick)
  }

  componentWillUnmount () {
    this.props.leaflet.map.off('click', this.onMapClick)
  }

  onMapClick = (e: MouseEvent) => {
    const p = this.props
    // if the destination component is already on the map, don't add it - change
    // destination by dragging destination marker
    if (!p.isRegionalAnalysisSamplingDistributionComponentOnMap) {
      p.setRegionalAnalysisOrigin({
        regionalAnalysisId: p._id,
        comparisonRegionalAnalysisId: p.comparisonId,
        lonlat: lonlat(e.latlng)
      })
    }
  }

  render () {
    const p = this.props

    if (!p.breaks || p.breaks.length === 0) {
      return <span /> // TODO do this one level higher
    } else if (p.comparisonId == null) {
      return (
        <Gridualizer
          breaks={p.breaks}
          colors={colors.REGIONAL_GRADIENT}
          grid={p.baseGrid}
        />
      )
    } else {
      // used to call mask() here

      return (
        <Gridualizer
          grid={p.differenceGrid}
          colors={colors.REGIONAL_COMPARISON_GRADIENT}
          breaks={p.breaks}
          noDataValue={NO_DATA}
        />
      )
    }
  }
}

// Add leaflet to props
export default withLeaflet(Regional)
