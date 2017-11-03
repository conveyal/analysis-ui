// @flow
import Icon from '@conveyal/woonerf/components/icon'
import React, {Component} from 'react'

import InnerDock from '../inner-dock'
import Selector from './regional-analysis-selector'

import type {Bounds} from '../../types'

type Props = {
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

const REFETCH_INTERVAL = 30 * 1000 // 30 seconds

export default class Regional extends Component {
  props: Props
  interval: number

  componentDidMount () {
    this.props.loadAllAnalyses()
    this.interval = window.setInterval(
      this.props.loadAllAnalyses,
      REFETCH_INTERVAL
    )
  }

  componentWillUnmount () {
    window.clearInterval(this.interval)
  }

  render () {
    const {
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
        <InnerDock>
          <div className='block'>
            {allAnalyses.length > 0
              ? <Selector
                allAnalyses={allAnalyses}
                deleteAnalysis={deleteAnalysis}
                goToAnalysis={goToAnalysis}
                />
              : <a onClick={goToSinglePointAnalysisPage} tabIndex={0}>
                  You have no running or completed regional analysis jobs! To create one, go to the single point analysis page.
                </a>}
          </div>
        </InnerDock>
      </div>
    )
  }
}
