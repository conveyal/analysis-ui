// @flow
import Icon from '@conveyal/woonerf/components/icon'
import React, {Component} from 'react'
import Select from 'react-select'
import {sprintf} from 'sprintf-js'

import AggregateAccessibility from './aggregate-accessibility'
import {Button} from '../buttons'
import InnerDock from '../inner-dock'
import Legend from './legend'
import {IconLink} from '../link'
import colors from '../../constants/colors'
import messages from '../../utils/messages'
import ProfileRequestDisplay from './profile-request-display'
import {Slider, Group, Text, File} from '../input'

import type {
  RegionalAnalysis,
  Grid,
  AggregationArea,
  AggregateAccessibility as AggregateAccessibilityType,
  OpportunityDataset,
  ReactSelectResult
} from '../../types'

type Props = {
  analysis?: RegionalAnalysis, // can be null when loading
  analysisId: string,
  breaks: number[],
  comparisonAnalysis?: RegionalAnalysis,
  differenceGrid?: Grid,
  grid?: Grid,
  aggregationAreas: AggregationArea[],
  opportunityDatasets: OpportunityDataset[],
  minimumImprovementProbability: number,
  regionId: string,
  projectId: string,
  regionalAnalyses?: RegionalAnalysis[],
  aggregationAreaId?: string,
  aggregationWeightsId?: string,
  aggregationAreaUploading?: boolean,
  aggregateAccessibility?: AggregateAccessibilityType,
  comparisonAggregateAccessibility?: AggregateAccessibilityType,
  accessToName: string,
  comparisonAccessToName?: string,
  aggregationWeightsName?: string,

  // actions
  addRegionalAnalysisLayerToMap: () => void,
  addRegionalComparisonLayerToMap: () => void,
  deleteAnalysis: (analysisId: string, projectId: string) => void,
  fetch: any => any,
  loadRegionalAnalyses: string => void,
  removeRegionalAnalysisLayerFromMap: () => void,
  removeRegionalComparisonLayerFromMap: () => void,
  setActiveRegionalAnalysis: any => void,
  setMinimumImprovementProbability: number => void,
  setAggregationArea: ({aggregationAreaId: string, regionId: string}) => void,
  setAggregationWeights: ({
    aggregationWeightsId: string,
    regionId: string
  }) => void,
  uploadAggregationArea: (arg: {
    name: string,
    files: FileList,
    regionId: string
  }) => void,
  addAggregationAreaComponentToMap: () => void,
  removeAggregationAreaComponentFromMap: () => void
}

type State = {
  showAggregationAreaUpload: boolean,
  aggregationAreaFiles: null | FileList,
  aggregationAreaName: null | string
}

/** render a regional analysis */
export default class RegionalResults extends Component<void, Props, State> {
  state = {
    aggregationAreaFiles: null,
    aggregationAreaName: null,
    showAggregationAreaUpload: false
  }

  componentDidMount () {
    const {
      analysis,
      analysisId,
      setActiveRegionalAnalysis,
      addRegionalAnalysisLayerToMap,
      loadRegionalAnalyses,
      regionId
    } = this.props
    if (analysis == null) {
      loadRegionalAnalyses(regionId)
    }

    setActiveRegionalAnalysis({_id: analysisId})
    addRegionalAnalysisLayerToMap()
  }

  _deleteAnalysis = () => {
    this.props.deleteAnalysis(this.props.analysisId, this.props.projectId)
  }

  selectComparisonAnalysis = (chosen: ReactSelectResult): void => {
    const {setActiveRegionalAnalysis, analysisId} = this.props

    if (chosen != null) {
      setActiveRegionalAnalysis({_id: analysisId, comparisonId: chosen.value})
    } else {
      // not a comparison
      setActiveRegionalAnalysis({_id: analysisId})
    }
  }

  selectAggregationArea = (e: ReactSelectResult) => {
    const {
      regionId,
      setAggregationArea,
      addAggregationAreaComponentToMap,
      removeAggregationAreaComponentFromMap
    } = this.props

    if (e) {
      if (e.value === 'new-aggregation-area') {
        this.setState({showAggregationAreaUpload: true})
      } else {
        setAggregationArea({regionId, aggregationAreaId: e.value})
        if (e.value != null) addAggregationAreaComponentToMap()
        else removeAggregationAreaComponentFromMap()
      }
    }
  }

  selectAggregationWeights = (e: ReactSelectResult) => {
    if (e) {
      const {regionId, setAggregationWeights} = this.props
      setAggregationWeights({regionId, aggregationWeightsId: e.value})
    }
  }

  renderComparisonSelector () {
    const {regionalAnalyses, comparisonAnalysis, analysis} = this.props

    if (!analysis || !regionalAnalyses) return null // don't render until loaded

    const options = regionalAnalyses
      .filter(({_id}) => _id !== analysis._id)
      // don't render deleted analyses
      .filter(({deleted}) => !deleted)
      // don't compare incomparable analyses
      .filter(
        ({zoom, width, height, north, west}) =>
          zoom === analysis.zoom &&
          width === analysis.width &&
          height === analysis.height &&
          north === analysis.north &&
          west === analysis.west
      )
      .map(({_id, name}) => {
        return {value: _id, label: name}
      })

    return (
      <Group label={messages.analysis.compareTo}>
        <Select
          value={comparisonAnalysis ? comparisonAnalysis._id : null}
          options={options}
          onChange={this.selectComparisonAnalysis}
        />
      </Group>
    )
  }

  /** Called when editing the new aggregation area name */
  changeAggregationAreaName = (e: Event & {target: {value: string}}): void =>
    this.setState({aggregationAreaName: e.target.value})

  /** Called when selecting files to upload */
  changeAggregationAreaFiles = (
    e: Event & {target: {files: FileList}}
  ): void => {
    this.setState({aggregationAreaFiles: e.target.files})
  }

  uploadAggregationArea = (e: Event): void => {
    e.preventDefault()
    const {uploadAggregationArea, regionId} = this.props
    const {aggregationAreaFiles, aggregationAreaName} = this.state

    if (!aggregationAreaName || !aggregationAreaFiles) {
      throw new Error('Attempt to upload null aggregation area')
    }

    uploadAggregationArea({
      name: aggregationAreaName,
      files: aggregationAreaFiles,
      regionId
    })
    this.setState({
      aggregationAreaName: null,
      aggregationAreaFiles: null,
      showAggregationAreaUpload: false
    })
  }

  /** Render controls for weighted average accessibility */
  renderAggregation () {
    const {
      aggregationAreas,
      aggregationAreaId,
      opportunityDatasets,
      aggregationWeightsId,
      aggregateAccessibility,
      comparisonAggregateAccessibility,
      comparisonAnalysis,
      aggregationAreaUploading,
      analysis
    } = this.props
    const {
      showAggregationAreaUpload,
      aggregationAreaName,
      aggregationAreaFiles
    } = this.state

    const aggregationAreaOptions = aggregationAreas.map(aa => ({
      value: aa._id,
      label: aa.name
    }))
    aggregationAreaOptions.push({
      label: messages.analysis.newAggregationArea,
      value: 'new-aggregation-area' // IDs of aggregation areas are UUIDs so this will not conflict
    })
    const opportunityDatasetOptions = opportunityDatasets.map(od => ({
      value: od.key,
      label: od.name
    }))

    return (
      <div>
        <Group label={messages.analysis.aggregateTo}>
          <Select
            name='aggregateTo'
            options={aggregationAreaOptions}
            value={aggregationAreaId}
            onChange={this.selectAggregationArea}
          />
        </Group>

        {showAggregationAreaUpload &&
          <form onSubmit={this.uploadAggregationArea}>
            <Group label={messages.analysis.aggregationAreaName}>
              <Text
                name='Name'
                value={aggregationAreaName}
                onChange={this.changeAggregationAreaName}
              />
            </Group>

            <Group label={messages.analysis.aggregationAreaFiles}>
              <File
                multiple
                name='files'
                onChange={this.changeAggregationAreaFiles}
              />
            </Group>

            <input
              className='btn btn-block btn-success'
              disabled={
                aggregationAreaUploading ||
                  !aggregationAreaName ||
                  !aggregationAreaFiles
              }
              type='submit'
              value={messages.analysis.uploadAggregationArea}
            />
          </form>}

        {aggregationAreaId &&
          <Group label={messages.analysis.weightBy}>
            <Select
              name='aggregationWeights'
              options={opportunityDatasetOptions}
              value={aggregationWeightsId}
              onChange={this.selectAggregationWeights}
            />
          </Group>}

        {aggregationAreaUploading &&
          <span>
            <Icon type='fa-spinner' spin />&nbsp;{messages.analysis.uploading}
          </span>}

        {analysis && aggregateAccessibility && aggregationWeightsId &&
          <AggregateAccessibility
            aggregateAccessibility={aggregateAccessibility}
            comparisonAggregateAccessibility={comparisonAggregateAccessibility}
            weightByName={this.findOpportunityDatasetName(aggregationWeightsId)}
            accessToName={this.findOpportunityDatasetName(analysis.grid)}
            regionalAnalysisName={analysis.name}
            comparisonAccessToName={
              comparisonAnalysis
                ? this.findOpportunityDatasetName(comparisonAnalysis.grid)
                : ''
            }
            comparisonRegionalAnalysisName={
              comparisonAnalysis
                ? comparisonAnalysis.name
                : ''
            }
          />}
      </div>
    )
  }

  /**
   * Perform an authenticated fetch to get a presigned URL to download a grid from S3,
   * then download it. Pass in the path to fetch.
   */
  downloadFromS3 (url: string) {
    const {fetch} = this.props
    fetch({
      url,
      next (error, response) {
        if (error) {
          window.alert(error)
        } else {
          window.open(response.value.url)
        }
      }
    })
  }

  downloadProjectGIS = (e: Event) => {
    e.preventDefault()
    if (this.props.analysis) {
      this.downloadFromS3(
        `/api/regional/${this.props.analysis._id}/grid/tiff?redirect=false`
      )
    } else {
      throw new Error('Attempt to dowload analysis that has not yet loaded!')
    }
  }

  downloadComparisonGIS = (e: Event) => {
    e.preventDefault()
    if (this.props.comparisonAnalysis) {
      this.downloadFromS3(
        `/api/regional/${this.props.comparisonAnalysis._id}/grid/tiff?redirect=false`
      )
    } else {
      throw new Error(
        'Attempt to dowload comparison analysis that has not yet loaded!'
      )
    }
  }

  downloadProbabilityGIS = (e: Event) => {
    e.preventDefault()
    // NB base comes first (TODO change?)
    if (this.props.analysis && this.props.comparisonAnalysis) {
      this.downloadFromS3(
        `/api/regional/${this.props.comparisonAnalysis._id}/${this.props.analysis._id}/tiff?redirect=false`
      )
    } else {
      throw new Error(
        'Attempt to download probability surface when both analyses have not loaded.'
      )
    }
  }

  render () {
    const {
      analysis,
      breaks,
      comparisonAnalysis,
      differenceGrid,
      grid,
      minimumImprovementProbability,
      setMinimumImprovementProbability,
      projectId
    } = this.props

    return (
      <div>
        <div className='ApplicationDockTitle'>
          <IconLink
            title='Regional results'
            to={`/projects/${projectId}/regional`}
            type='chevron-left'
          />
          {analysis ? analysis.name : 'Loading...'}
          <IconLink
            className='pull-right'
            onClick={this._deleteAnalysis}
            title={messages.analysis.deleteRegionalAnalysis}
            type='trash'
          />
        </div>
        <InnerDock>
          <div className='block'>
            {!analysis
              ? <p>Loading...</p>
              : <div>
                {this.renderComparisonSelector()}

                {comparisonAnalysis &&
                  <MinimumImprovementProbabilitySelector
                    minimumImprovementProbability={minimumImprovementProbability}
                    setMinimumImprovementProbability={
                      setMinimumImprovementProbability
                    }
                  />}

                <p>
                  {analysis.travelTimePercentile !== -1 &&
                    sprintf(messages.analysis.accessTo, {
                      opportunity: this.findOpportunityDatasetName(analysis.grid),
                      cutoff: analysis.cutoffMinutes,
                      percentile: analysis.travelTimePercentile
                    })}
                  {analysis.travelTimePercentile === -1 &&
                    sprintf(messages.analysis.accessToInstantaneous, {
                      opportunity: this.findOpportunityDatasetName(analysis.grid),
                      cutoff: analysis.cutoffMinutes
                    })}
                </p>

                {comparisonAnalysis &&
                  <p>
                    {comparisonAnalysis.travelTimePercentile !== -1 &&
                      sprintf(messages.analysis.comparisonAccessTo, {
                        opportunity: this.findOpportunityDatasetName(comparisonAnalysis.grid),
                        cutoff: comparisonAnalysis.cutoffMinutes,
                        percentile: comparisonAnalysis.travelTimePercentile
                      })}
                    {comparisonAnalysis.travelTimePercentile === -1 &&
                      sprintf(messages.analysis.comparisonAccessToInstantaneous, {
                        opportunity: this.findOpportunityDatasetName(comparisonAnalysis.grid),
                        cutoff: comparisonAnalysis.cutoffMinutes
                      })}
                  </p>}

                {grid
                  ? <Legend
                    breaks={breaks}
                    min={
                      comparisonAnalysis != null && differenceGrid != null
                        ? differenceGrid.min
                        : grid.min
                    }
                    colors={
                      comparisonAnalysis != null
                        ? colors.REGIONAL_COMPARISON_GRADIENT
                        : colors.REGIONAL_GRADIENT
                    }
                  />
                  : <p>Loading grids...</p>}

                <Group label={sprintf(messages.analysis.settingsFor, analysis.name)}>
                  <ProfileRequestDisplay
                    {...analysis.request}
                    workerVersion={analysis.workerVersion}
                    />
                </Group>

                {comparisonAnalysis &&
                  <Group
                    label={sprintf(
                      messages.analysis.settingsFor,
                      comparisonAnalysis.name
                    )}
                  >

                    {analysis.workerVersion !== comparisonAnalysis.workerVersion &&
                      <div className='alert alert-danger'>{messages.r5Version.comparisonIsDifferent}</div>}

                    <ProfileRequestDisplay
                      {...comparisonAnalysis.request}
                      workerVersion={comparisonAnalysis.workerVersion}
                      />
                  </Group>}

                {this.renderAggregation()}

                <Group label={messages.analysis.gisExport}>
                  <Button block onClick={this.downloadProjectGIS} style='info'>
                    {sprintf(messages.analysis.downloadRegional, analysis.name)}
                  </Button>
                  {comparisonAnalysis &&
                    <Button block onClick={this.downloadComparisonGIS} style='info'>
                      {sprintf(
                        messages.analysis.downloadRegional,
                        comparisonAnalysis.name
                      )}
                    </Button>}
                  {comparisonAnalysis &&
                    <Button block onClick={this.downloadProbabilityGIS} style='info'>
                      {messages.analysis.downloadRegionalProbability}
                    </Button>}
                </Group>
              </div>}
          </div>
        </InnerDock>
      </div>
    )
  }

  componentWillUnmount () {
    const {
      removeRegionalAnalysisLayerFromMap,
      removeRegionalComparisonLayerFromMap
    } = this.props
    removeRegionalAnalysisLayerFromMap()
    removeRegionalComparisonLayerFromMap()
  }

  // TODO replace with selector
  findOpportunityDatasetName (key: string): string {
    const value = this.props.opportunityDatasets.find(i => i.key === key)
    return value != null ? value.name : key
  }
}

function MinimumImprovementProbabilitySelector ({
  minimumImprovementProbability,
  setMinimumImprovementProbability
}) {
  return (
    <Slider
      label={messages.analysis.minimumImprovementProbability}
      output
      format='.2f'
      min={0}
      max={1}
      step={0.01}
      value={minimumImprovementProbability}
      onChange={e =>
        setMinimumImprovementProbability(parseFloat(e.target.value))}
    />
  )
}
