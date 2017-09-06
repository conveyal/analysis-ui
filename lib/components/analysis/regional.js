// @flow
import Icon from '@conveyal/woonerf/components/icon'
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
  goToSinglePointAnalysisPage: () => void,
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
      goToAnalysis,
      goToSinglePointAnalysisPage
    } = this.props

    return (
      <div>
        <div className='ApplicationDockTitle'>
          <Icon type='server' /> Regional Analyses
        </div>
        <div className='InnerDock'>
          <br />
          <div className='block'>
            {allAnalyses.length > 0
              ? <Selector
                allAnalyses={allAnalyses}
                deleteAnalysis={deleteAnalysis}
                goToAnalysis={goToAnalysis}
                />
              : <a
                onClick={goToSinglePointAnalysisPage}
                tabIndex={0}
                >You have no running or completed regional analysis jobs! To create one, go to the single point analysis page.
                </a>}
          </div>
          {activeAnalysis &&
            <Results
              analysis={activeAnalysis}
              deleteAnalysis={deleteAnalysis}
            />}
        </div>
      </div>
    )
  }
}
