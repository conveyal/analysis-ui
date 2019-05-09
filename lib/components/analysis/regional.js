import lonlat from '@conveyal/lonlat'
import dynamic from 'next/dynamic'
import React from 'react'

import message from 'lib/message'

import {Application, Dock, Title} from '../base'
import {IconLink} from '../link'

import ProfileRequestDisplay from './profile-request-display'
import RegionalResults from './regional-results'
import RunningAnalysis from './running-analysis'

const AggregationArea = dynamic(
  () => import('lib/containers/aggregation-area'),
  {ssr: false}
)
const DotMap = dynamic(() =>
  import('lib/modules/opportunity-datasets/components/dotmap')
)
const LabelLayer = dynamic(() => import('../map/label-layer'), {ssr: false})
const RegionalLayer = dynamic(() => import('lib/containers/regional-layer'), {
  ssr: false
})
const Rectangle = dynamic(
  () => import('react-leaflet').then(l => l.Rectangle),
  {ssr: false}
)

export default class RegionalAnalysis extends React.PureComponent {
  componentDidMount() {
    const p = this.props
    p.loadRegionalAnalyses(p.regionId)
    p.setActiveRegionalAnalysis({_id: p.analysisId})
    if (p.opportunityDatasets.length === 0) p.loadOpportunityDatasets()
  }

  _deleteAnalysis = () => {
    if (
      window.confirm('Are you sure you want to delete this regional analysis?')
    ) {
      const p = this.props
      p.deleteAnalysis(p.analysis)
    }
  }

  _renameAnalysis = () => {
    const analysis = this.props.analysis
    const name = window.prompt('Please enter a new name', analysis.name)
    if (name != null && name !== analysis.name) {
      this.props.updateRegionalAnalysis({...analysis, name})
    }
  }

  _isComplete() {
    const p = this.props
    return (
      !!p.analysis &&
      (p.analysis.status == null ||
        p.analysis.status.complete === p.analysis.status.total)
    )
  }

  /**
   * Unproject the analysis bounds into `Leaflet.LatLng` points to be used for a
   * rectangle. NB code was copied from another location that also incremented
   * `west` by 1. Possibly to ensure non-zero numbers.
   */
  _getAnalysisBounds() {
    const {north, west, width, height, zoom} = this.props.analysis
    const nw = lonlat.fromPixel({x: west + 1, y: north}, zoom)
    const se = lonlat.fromPixel({x: west + width + 1, y: north + height}, zoom)
    return [lonlat.toLeaflet(nw), lonlat.toLeaflet(se)]
  }

  _map = () => {
    const p = this.props
    if (!this.props.analysis) return null

    return (
      <>
        {!this._isComplete() && (
          <Rectangle bounds={this._getAnalysisBounds()} weight={2} />
        )}

        <DotMap />
        <RegionalLayer />
        {p.aggregationAreaId && <AggregationArea />}
        <LabelLayer />
      </>
    )
  }

  render() {
    const p = this.props
    const isLoaded = !!p.analysis
    return (
      <Application map={this._map}>
        <Title>
          <IconLink
            title='Regional results'
            to={`/regions/${p.regionId}/regional`}
            type='chevron-left'
          />
          {isLoaded ? p.analysis.name : message('common.loading')}
          <IconLink
            className='pull-right'
            onClick={this._deleteAnalysis}
            title={message('analysis.deleteRegionalAnalysis')}
            type='trash'
          />
          {isLoaded && (
            <IconLink
              className='pull-right'
              onClick={this._renameAnalysis}
              title={message('analysis.renameRegionalAnalysis')}
              type='pencil'
            />
          )}
        </Title>
        <Dock>
          {isLoaded ? (
            <div>
              <ProfileRequestDisplay
                defaultExpanded={!this._isComplete()}
                {...p.analysis}
                {...p.analysis.request}
              />
              {this._isComplete() ? (
                <RegionalResults {...p} />
              ) : (
                <RunningAnalysis
                  analysis={p.analysis}
                  onDelete={this._deleteAnalysis}
                />
              )}
            </div>
          ) : (
            <p>{message('common.loading')}</p>
          )}
        </Dock>
      </Application>
    )
  }
}
