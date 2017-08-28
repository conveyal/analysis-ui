// @flow
import React, {Component} from 'react'

import Results from '../../containers/regional-analysis-results'
import Selector from './regional-analysis-selector'

import type {Bounds, RegionalAnalysis} from '../../types'

type Props = {
  activeAnalysis?: RegionalAnalysis,
  allAnalyses: Array<Bounds & {
    id: string,
    name: string,
    height: number,
    width: number,
    zoom: number
  }>,

  deleteAnalysis: (analysisId: string) => void,
  goToAnalysis: (analysisId: string) => void,
  loadAllAnalyses: () => void
}

const REFETCH_INTERVAL = 10 * 1000

export default class Regional extends Component {
  props: Props
  interval: number

  componentDidMount () {
    this.props.loadAllAnalyses()
    this.interval = window.setInterval(this.props.loadAllAnalyses, REFETCH_INTERVAL)
  }

  componentWillUnmount () {
    window.clearInterval(this.interval)
  }

  render () {
    const {
      activeAnalysis,
      allAnalyses,
      deleteAnalysis,
      goToAnalysis
    } = this.props

    return (
      <div>
        <div className='DockTitle'>Regional Analyses</div>
        <div className='block'>
          <Selector
            allAnalyses={allAnalyses}
            goToAnalysis={goToAnalysis}
            />
        </div>
        {activeAnalysis &&
          <Results
            analysis={activeAnalysis}
            deleteAnalysis={deleteAnalysis}
          />}
      </div>
    )
  }
}
