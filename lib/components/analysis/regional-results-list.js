// @flow
import Icon from '@conveyal/woonerf/components/icon'
import React, {Component} from 'react'

import ErrorModal from '../error-modal'
import InnerDock from '../inner-dock'
import Map from '../map'
import Selector from './regional-analysis-selector'
import Sidebar from '../sidebar'

import type {Bounds} from '../../types'

type RegionalAnalysis = Bounds & {
  _id: string,
  name: string,
  height: number,
  width: number,
  zoom: number
}

type Props = {
  allAnalyses: RegionalAnalysis[],
  regionId: string,

  deleteAnalysis: (analysisId: string) => void,
  goToAnalysis: ({analysisId: string, regionId: string}) => void,
  goToSinglePointAnalysisPage: () => void,
  loadAllAnalyses: () => void
}

const REFETCH_INTERVAL = 30 * 1000 // 30 seconds

export default class RegionalAnalysisResultsList extends Component {
  props: Props
  interval: number

  _loadAnalyses = () => {
    this.props.loadAllAnalyses(this.props.regionId)
  }

  componentDidMount () {
    this._loadAnalyses()
    this.interval = window.setInterval(this._loadAnalyses, REFETCH_INTERVAL)
  }

  componentWillUnmount () {
    window.clearInterval(this.interval)
  }

  render () {
    const p = this.props
    return (
      <div>
        <Sidebar />
        <ErrorModal />

        <div className='Fullscreen'>
          <Map />
        </div>

        <div className='ApplicationDock'>
          <div className='ApplicationDockTitle'>
            <Icon type='server' /> Regional Analyses
          </div>
          <InnerDock>
            <div className='block'>
              {p.allAnalyses.length > 0
                ? <Selector
                  allAnalyses={p.allAnalyses}
                  deleteAnalysis={p.deleteAnalysis}
                  goToAnalysis={(analysisId) =>
                    p.goToAnalysis({analysisId, regionId: p.regionId})}
                  />
                : <a
                  onClick={() => p.goToSinglePointAnalysisPage(p.regionId)}
                  tabIndex={0}
                >You have no running or completed regional analysis jobs! To create one, go to the single point analysis page.
                  </a>}
            </div>
          </InnerDock>
        </div>
      </div>
    )
  }
}
