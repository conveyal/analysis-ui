// @flow
/** render a regional analysis */

import Icon from '@conveyal/woonerf/components/icon'
import React, {Component} from 'react'
import Select from 'react-select'
import {sprintf} from 'sprintf-js'

import AggregateAccessibility from './aggregate-accessibility'
import Legend from './legend'
import colors from '../../constants/colors'
import messages from '../../utils/messages'
import ProfileRequestDisplay from './profile-request-display'
import Collapsible from '../collapsible'
import {Slider, Group, Text, File} from '../input'

import type {
  RegionalAnalysis,
  Grid,
  AggregationArea,
  AggregateAccessibility as AggregateAccessibilityType,
  Indicator,
  ReactSelectResult
} from '../../types'

type Props = {
  analysis: ?RegionalAnalysis, // can be null when loading
  analysisId: string,
  breaks: number[],
  comparisonAnalysis: ?RegionalAnalysis,
  differenceGrid: ?Grid,
  grid: ?Grid,
  aggregationAreas: AggregationArea[],
  indicators: Indicator[],
  minimumImprovementProbability: number,
  projectId: string,
  regionalAnalyses: ?(RegionalAnalysis[]),
  aggregationAreaId: ?string,
  aggregationWeightsId: ?string,
  aggregationAreaUploading: ?boolean,
  aggregateAccessibility: ?AggregateAccessibilityType,
  comparisonAggregateAccessibility: ?AggregateAccessibilityType,
  accessToName: string,
  comparisonAccessToName: ?string,
  aggregationWeightsName: ?string,

  // actions
  addRegionalAnalysisLayerToMap: () => void,
  addRegionalComparisonLayerToMap: () => void,
  fetch: any => any,
  loadRegionalAnalyses: string => void,
  removeRegionalAnalysisLayerFromMap: () => void,
  removeRegionalComparisonLayerFromMap: () => void,
  setActiveRegionalAnalysis: any => void,
  setMinimumImprovementProbability: number => void,
  setAggregationArea: ({aggregationAreaId: string, projectId: string}) => void,
  setAggregationWeights: ({
    aggregationWeightsId: string,
    projectId: string
  }) => void,
  uploadAggregationArea: (arg: {
    name: string,
    files: FileList,
    projectId: string
  }) => void,
  addAggregationAreaComponentToMap: () => void,
  removeAggregationAreaComponentFromMap: () => void
}

type State = {
  showAggregationAreaUpload: boolean,
  aggregationAreaFiles: null | FileList,
  aggregationAreaName: null | string
}

export default class RegionalAnalysisDisplay extends Component<
  void,
  Props,
  State
> {
  state = {
    aggregationAreaFiles: null,
    aggregationAreaName: null,
    showAggregationAreaUpload: false
  }

  componentWillMount () {
    const {
      analysis,
      analysisId,
      setActiveRegionalAnalysis,
      addRegionalAnalysisLayerToMap,
      loadRegionalAnalyses,
      projectId
    } = this.props
    if (analysis == null) {
      loadRegionalAnalyses(projectId)
    }

    setActiveRegionalAnalysis({id: analysisId})
    addRegionalAnalysisLayerToMap()
  }

  selectComparisonAnalysis = (chosen: ReactSelectResult): void => {
    const {setActiveRegionalAnalysis, analysisId} = this.props

    if (chosen != null) {
      setActiveRegionalAnalysis({id: analysisId, comparisonId: chosen.value})
    } else {
      // not a comparison
      setActiveRegionalAnalysis({id: analysisId})
    }
  }

  selectAggregationArea = (e: ReactSelectResult) => {
    const {
      projectId,
      setAggregationArea,
      addAggregationAreaComponentToMap,
      removeAggregationAreaComponentFromMap
    } = this.props

    if (e) {
      if (e.value === 'new-aggregation-area') {
        this.setState({showAggregationAreaUpload: true})
      } else {
        setAggregationArea({projectId, aggregationAreaId: e.value})
        if (e.value != null) addAggregationAreaComponentToMap()
        else removeAggregationAreaComponentFromMap()
      }
    }
  }

  selectAggregationWeights = (e: ReactSelectResult) => {
    if (e) {
      const {projectId, setAggregationWeights} = this.props
      setAggregationWeights({projectId, aggregationWeightsId: e.value})
    }
  }

  renderComparisonSelector () {
    const {regionalAnalyses, comparisonAnalysis, analysis} = this.props

    if (!analysis || !regionalAnalyses) return null // don't render until loaded

    const options = regionalAnalyses
      .filter(({id}) => id !== analysis.id)
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
      .map(({id, name}) => {
        return {value: id, label: name}
      })

    return (
      <div>
        <Select
          value={comparisonAnalysis ? comparisonAnalysis.id : null}
          options={options}
          onChange={this.selectComparisonAnalysis}
          placeholder={messages.analysis.compareTo}
        />
      </div>
    )
  }

  /** Called when editing the new aggregation area name */
  changeAggregationAreaName = (e: Event & {target: {value: string}}): void => {
    this.setState({aggregationAreaName: e.target.value})
  }

  /** Called when selecting files to upload */
  changeAggregationAreaFiles = (e: Event & {target: {files: File[]}}): void => {
    this.setState({aggregationAreaFiles: e.target.files})
  }

  uploadAggregationArea = (e: Event): void => {
    e.preventDefault()
    const {uploadAggregationArea, projectId} = this.props
    const {aggregationAreaFiles, aggregationAreaName} = this.state

    if (!aggregationAreaName || !aggregationAreaFiles) {
      throw new Error('Attempt to upload null aggregation area')
    }

    uploadAggregationArea({
      name: aggregationAreaName,
      files: aggregationAreaFiles,
      projectId
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
      indicators,
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

    // this same conditional is in the render function before this function is ever called, but flow
    // doesn't know that
    if (!analysis) return

    const aggregationAreaOptions = aggregationAreas.map(aa => ({
      value: aa.id,
      label: aa.name
    }))
    aggregationAreaOptions.push({
      label: messages.analysis.newAggregationArea,
      value: 'new-aggregation-area' // IDs of aggregation areas are UUIDs so this will not conflict
    })
    const opportunityDatasetOptions = indicators.map(od => ({
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

        {aggregateAccessibility &&
          aggregationWeightsId &&
          <AggregateAccessibility
            aggregateAccessibility={aggregateAccessibility}
            comparisonAggregateAccessibility={comparisonAggregateAccessibility}
            weightByName={this.findIndicatorName(aggregationWeightsId)}
            accessToName={this.findIndicatorName(analysis.grid)}
            regionalAnalysisName={analysis.name}
            comparisonAccessToName={
              comparisonAnalysis &&
              this.findIndicatorName(comparisonAnalysis.grid)
            }
            comparisonRegionalAnalysisName={
              comparisonAnalysis && comparisonAnalysis.name
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

  downloadScenarioGIS = (e: Event) => {
    e.preventDefault()
    if (this.props.analysis) {
      this.downloadFromS3(
        `/api/regional/${this.props.analysis.id}/grid/tiff?redirect=false`
      )
    } else {
      throw new Error('Attempt to dowload analysis that has not yet loaded!')
    }
  }

  downloadComparisonGIS = (e: Event) => {
    e.preventDefault()
    if (this.props.comparisonAnalysis) {
      this.downloadFromS3(
        `/api/regional/${this.props.comparisonAnalysis
          .id}/grid/tiff?redirect=false`
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
        `/api/regional/${this.props.comparisonAnalysis.id}/${this.props.analysis
          .id}/tiff?redirect=false`
      )
    } else {
      throw new Error(
        'Attempt to download probability surface when both analyses have not loaded.'
      )
    }
  }

  renderGisExport () {
    const {analysis, comparisonAnalysis} = this.props

    // this is also done in the main render block but flow doesn't know that
    if (!analysis) return

    // we use <a> tags not buttons in order to get text wrapping; all event handlers prevent default
    return (
      <div>
        <b>
          <Icon type='map-o' />
          {messages.analysis.gisExport}
        </b>
        <ul>
          <li>
            <a onClick={this.downloadScenarioGIS} tabIndex={0}>
              {sprintf(messages.analysis.downloadRegional, analysis.name)}
            </a>
          </li>
          {comparisonAnalysis &&
            <li>
              <a onClick={this.downloadComparisonGIS} tabIndex={0}>
                {sprintf(
                  messages.analysis.downloadRegional,
                  comparisonAnalysis.name
                )}
              </a>
            </li>}
          {comparisonAnalysis &&
            <li>
              <a onClick={this.downloadProbabilityGIS} tabIndex={0}>
                {messages.analysis.downloadRegionalProbability}
              </a>
            </li>}
        </ul>
      </div>
    )
  }

  render () {
    const {
      analysis,
      breaks,
      comparisonAnalysis,
      differenceGrid,
      grid,
      indicators,
      minimumImprovementProbability,
      setMinimumImprovementProbability
    } = this.props

    if (analysis == null || grid == null || indicators == null) return null

    return (
      <div>
        <h3>
          {analysis.name}
        </h3>

        {this.renderComparisonSelector()}

        {comparisonAnalysis &&
          <MinimumImprovementProbabilitySelector
            minimumImprovementProbability={minimumImprovementProbability}
            setMinimumImprovementProbability={setMinimumImprovementProbability}
          />}

        <div>
          <i>
            {analysis.travelTimePercentile !== -1 &&
              sprintf(messages.analysis.accessTo, {
                opportunity: this.findIndicatorName(analysis.grid),
                cutoff: analysis.cutoffMinutes,
                percentile: analysis.travelTimePercentile
              })}
            {analysis.travelTimePercentile === -1 &&
              sprintf(messages.analysis.accessToInstantaneous, {
                opportunity: this.findIndicatorName(analysis.grid),
                cutoff: analysis.cutoffMinutes
              })}
          </i>
        </div>

        {comparisonAnalysis &&
          <div>
            <i>
              {comparisonAnalysis.travelTimePercentile !== -1 &&
                sprintf(messages.analysis.comparisonAccessTo, {
                  opportunity: this.findIndicatorName(comparisonAnalysis.grid),
                  cutoff: comparisonAnalysis.cutoffMinutes,
                  percentile: comparisonAnalysis.travelTimePercentile
                })}
              {comparisonAnalysis.travelTimePercentile === -1 &&
                sprintf(messages.analysis.comparisonAccessToInstantaneous, {
                  opportunity: this.findIndicatorName(comparisonAnalysis.grid),
                  cutoff: comparisonAnalysis.cutoffMinutes
                })}
            </i>
          </div>}

        <Legend
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

        <Collapsible
          title={sprintf(messages.analysis.settingsFor, analysis.name)}
        >
          <ProfileRequestDisplay request={analysis.request} />
        </Collapsible>

        {comparisonAnalysis &&
          <Collapsible
            title={sprintf(
              messages.analysis.settingsFor,
              comparisonAnalysis.name
            )}
          >
            <ProfileRequestDisplay request={comparisonAnalysis.request} />
          </Collapsible>}

        {this.renderAggregation()}

        {this.renderGisExport()}
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
  findIndicatorName (key: string): string {
    const value = this.props.indicators.find(i => i.key === key)
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
