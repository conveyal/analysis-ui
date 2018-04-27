// @flow
import message from '@conveyal/woonerf/message'
import React from 'react'

import InnerDock from '../inner-dock'
import {IconLink} from '../link'

import ProfileRequestDisplay from './profile-request-display'
import RegionalResults from './regional-results'
import RunningAnalysis from './running-analysis'

type Props = {
  analysis: any,
  analysisId: string,
  projectId: string,
  regionId: string,

  deleteAnalysis: (analysisId: string, projectId: string) => void,
  loadRegionalAnalyses: (regionId: string) => void,
  renameAnalysis: (newName: string) => void
}

export default class RegionalAnalysis extends React.PureComponent {
  props: Props

  componentDidMount () {
    const p = this.props
    p.loadRegionalAnalyses(p.regionId)
    p.setActiveRegionalAnalysis({_id: p.analysisId})
  }

  _deleteAnalysis = () => {
    const p = this.props
    p.deleteAnalysis(p.analysisId, p.projectId)
  }

  _renameAnalysis = () => {
    const analysis = this.props.analysis
    const name = window.prompt('Please enter a new name', analysis.name)
    if (name != null && name !== analysis.name) {
      this.props.updateRegionalAnalysis({...analysis, name})
    }
  }

  render () {
    const p = this.props
    const isLoaded = !!p.analysis
    const isComplete = isLoaded && (p.analysis.status == null || p.analysis.status.complete === p.analysis.status.total)
    return (
      <div>
        <div className='ApplicationDockTitle'>
          <IconLink
            title='Regional results'
            to={`/projects/${p.projectId}/regional`}
            type='chevron-left'
          />
          {isLoaded ? p.analysis.name : message('common.loading')}
          <IconLink
            className='pull-right'
            onClick={this._deleteAnalysis}
            title={message('analysis.deleteRegionalAnalysis')}
            type='trash'
          />
          {isLoaded &&
            <IconLink
              className='pull-right'
              onClick={this._renameAnalysis}
              title={message('analysis.renameRegionalAnalysis')}
              type='pencil'
            />}
        </div>
        <InnerDock>
          <div className='block'>
            {isLoaded
              ? isComplete
                ? <RegionalResults {...p} />
                : <div>
                  <RunningAnalysis analysis={p.analysis} onDelete={this._deleteAnalysis} />
                  <br />
                  <ProfileRequestDisplay {...p.analysis} {...p.analysis.request} />
                </div>
              : <p>{message('common.loading')}</p>}
          </div>
        </InnerDock>
      </div>
    )
  }
}
