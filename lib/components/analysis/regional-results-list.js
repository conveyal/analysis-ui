import {faServer} from '@fortawesome/free-solid-svg-icons'
import React, {Component} from 'react'

import ErrorModal from '../error-modal'
import Icon from '../icon'
import InnerDock from '../inner-dock'
import Map from '../map'
import Sidebar from '../sidebar'

import Selector from './regional-analysis-selector'

const REFETCH_INTERVAL = 30 * 1000 // 30 seconds

export default class RegionalAnalysisResultsList extends Component {
  state = {}

  _loadAnalyses = () => {
    this.props.loadAllAnalyses(this.props.regionId)
  }

  componentDidMount() {
    this._loadAnalyses()
    this.interval = window.setInterval(this._loadAnalyses, REFETCH_INTERVAL)
  }

  componentWillUnmount() {
    window.clearInterval(this.interval)
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    }
  }

  render() {
    const s = this.state
    if (s.hasError) {
      return (
        <ErrorModal
          error={s.error.name}
          errorMessage={s.error.message}
          stack={s.error.stack}
        />
      )
    }

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
            <Icon icon={faServer} /> Regional Analyses
          </div>
          <InnerDock>
            <div className='block'>
              {p.allAnalyses.length > 0 ? (
                <Selector
                  allAnalyses={p.allAnalyses}
                  deleteAnalysis={p.deleteAnalysis}
                  goToAnalysis={analysisId =>
                    p.goToAnalysis({analysisId, regionId: p.regionId})
                  }
                />
              ) : (
                <a
                  onClick={() => p.goToSinglePointAnalysisPage(p.regionId)}
                  tabIndex={0}
                >
                  You have no running or completed regional analysis jobs! To
                  create one, go to the single point analysis page.
                </a>
              )}
            </div>
          </InnerDock>
        </div>
      </div>
    )
  }
}
