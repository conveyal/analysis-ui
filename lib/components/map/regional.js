// @flow
import lonlat from '@conveyal/lonlat'
import {Map, MouseEvent} from 'leaflet'
import PropTypes from 'prop-types'
import React, {Component} from 'react'

import colors from '../../constants/colors'
import Gridualizer from './gridualizer'

import type {Grid} from '../../types'

const NO_DATA = -Math.pow(2, 30)

type Props = {
  _id: string,
  baseGrid: Grid,
  breaks: number[],
  comparisonId: string,
  differenceGrid: Grid,
  isRegionalAnalysisSamplingDistributionComponentOnMap: boolean,
  probabilityGrid: Grid,
  removeRegionalAnalysisSamplingDistributionComponentFromMap: () => void,
  setRegionalAnalysisOrigin: Object => void
}


/**
 * A layer showing a proabilistic regional comparison
 */
export default class Regional extends Component<DefaultProps, Props, void> {

  static contextTypes = {
    map: PropTypes.instanceOf(Map)
  }

  componentDidMount () {
    const {map} = this.context
    map.on('click', this.onMapClick)
  }

  componentWillUnmount () {
    const {
      isRegionalAnalysisSamplingDistributionComponentOnMap,
      removeRegionalAnalysisSamplingDistributionComponentFromMap
    } = this.props
    const {map} = this.context
    map.off('click', this.onMapClick)
    if (isRegionalAnalysisSamplingDistributionComponentOnMap) {
      // don't leave dest travel time distribution on map when exiting analysis mode
      removeRegionalAnalysisSamplingDistributionComponentFromMap()
    }
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
      probabilityGrid,
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
