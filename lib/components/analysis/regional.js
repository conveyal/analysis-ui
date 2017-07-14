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

import type {RegionalAnalysis, Grid, Mask, ReactSelectOptions, Indicator} from '../../lib/types'

type Props = {
  analysis: ?RegionalAnalysis, // can be null when loading
  analysisId: string,
  breaks: number[],
  comparisonAnalysis: ?RegionalAnalysis,
  differenceGrid: ?Grid,
  grid: ?Grid,
  masks: ?Mask[],
  indicators: ?Indicator[],
  minimumImprovementProbability: number,
  projectId: string,
  regionalAnalyses: ?RegionalAnalysis[],
  maskId: ?string,
  maskWeightsId: ?string,
  maskUploading: ?boolean,

  // actions
  addRegionalAnalysisLayerToMap: () => void,
  addRegionalComparisonLayerToMap: () => void,
  fetch: any => any,
  loadRegionalAnalyses: () => void,
  removeRegionalAnalysisLayerFromMap: () => void,
  removeRegionalComparisonLayerFromMap: () => void,
  setActiveRegionalAnalysis: (any) => void,
  setMinimumImprovementProbability: (number) => void,
  setMask: (string) => void,
  setMaskWeights: (string) => void,
  uploadMask: (arg: {name: string, files: HTMLFileElement[], projectId: string}) => void
}

export default class RegionalAnalysisDisplay extends Component<void, Props, void> {
  state = {
    showMaskUpload: false
  }

  componentWillMount () {
    const { analysis, analysisId, setActiveRegionalAnalysis, addRegionalAnalysisLayerToMap, loadRegionalAnalyses, projectId } = this.props
    if (analysis == null) {
      loadRegionalAnalyses(projectId)
    }

    setActiveRegionalAnalysis({ id: analysisId })
    addRegionalAnalysisLayerToMap()
  }

  selectComparisonAnalysis = (chosen) => {
    const {
      setActiveRegionalAnalysis,
      analysisId,
      addRegionalAnalysisLayerToMap,
      removeRegionalAnalysisLayerFromMap,
      addRegionalComparisonLayerToMap,
      removeRegionalComparisonLayerFromMap
    } = this.props

    if (chosen != null) {
      setActiveRegionalAnalysis({ id: analysisId, comparisonId: chosen.value })
      removeRegionalAnalysisLayerFromMap()
      addRegionalComparisonLayerToMap()
    } else {
      // not a comparison
      setActiveRegionalAnalysis({ id: analysisId })
      removeRegionalComparisonLayerFromMap()
      addRegionalAnalysisLayerToMap()
    }
  }

  selectMask = (e: ReactSelectOptions) => {
    const {projectId, setMask} = this.props

    if (e.value === 'new-mask') {
      this.setState({ showMaskUpload: true })
    } else {
      setMask({ projectId, maskId: e.value })
    }
  }

  selectMaskWeights = (e: ReactSelectOptions) => {
    const {projectId, setMaskWeights} = this.props
    setMaskWeights({ projectId, maskWeightsId: e.value })
  }

  renderComparisonSelector () {
    const { regionalAnalyses, comparisonAnalysis, analysis } = this.props

    if (!analysis) return null // don't render until loaded

    const options = regionalAnalyses
      .filter(({ id }) => id !== analysis.id)
      // don't compare incomparable analyses
      .filter(({ zoom, width, height, north, west }) =>
        zoom === analysis.zoom &&
        width === analysis.width &&
        height === analysis.height &&
        north === analysis.north &&
        west === analysis.west
      )
      .map(({ id, name }) => { return { value: id, label: name } })

    return <div>
      <Select
        value={comparisonAnalysis ? comparisonAnalysis.id : null}
        options={options}
        onChange={this.selectComparisonAnalysis}
        placeholder={messages.analysis.compareTo}
        />
    </div>
  }

  /** Called when editing the new mask name */
  changeMaskName = (e: Event & { target: { value: string }}): void => {
    this.setState({ maskName: e.target.value })
  }

  /** Called when selecting files to upload */
  changeMaskFiles = (e: Event & { target: { files: File[] }}): void => {
    this.setState({ maskFiles: e.target.files })
  }

  uploadMask = (e: Event): void => {
    e.preventDefault()
    const {uploadMask, projectId} = this.props
    const {maskFiles, maskName} = this.state
    uploadMask({ name: maskName, files: maskFiles, projectId })
    this.setState({ maskName: null, maskFiles: null, showMaskUpload: false })
  }

  /** Render controls for weighted average accessibility */
  renderAggregation () {
    const {masks, maskId, indicators, maskWeightsId, aggregateAccessibility, comparisonAggregateAccessibility, maskUploading, analysis} = this.props
    const {showMaskUpload, maskName, maskFiles} = this.state

    const maskOptions = masks.map(m => ({ value: m.id, label: m.name }))
    maskOptions.push({
      label: messages.analysis.newMask,
      value: 'new-mask' // IDs of masks are UUIDs so this will not conflict
    })
    const opportunityDatasetOptions = indicators.map(od => ({ value: od.key, label: od.name }))

    return <div>
      <Group label={messages.analysis.aggregateTo}>
        <Select
          name='aggregateTo'
          options={maskOptions}
          value={maskId}
          onChange={this.selectMask} />
      </Group>

      {showMaskUpload && <form onSubmit={this.uploadMask}>
        <Group label={messages.analysis.maskName}>
          <Text
            name='Name'
            value={maskName}
            onChange={this.changeMaskName} />
        </Group>

        <Group label={messages.analysis.maskFiles}>
          <File
            multiple
            name='files'
            onChange={this.changeMaskFiles} />
        </Group>

        <input
          className='btn btn-block btn-success'
          disabled={maskUploading || !maskName || !maskFiles}
          type='submit'
          value={messages.analysis.uploadMask}
          />
      </form>}

      {maskId && <Group label={messages.analysis.weightBy}>
        <Select
          name='maskWeights'
          options={opportunityDatasetOptions}
          value={maskWeightsId}
          onChange={this.selectMaskWeights} />
      </Group>}

      {maskUploading && <span><Icon type='fa-spinner' spin />&nbsp;{messages.analysis.uploading}</span>}

      {aggregateAccessibility && <AggregateAccessibility
        aggregateAccessibility={aggregateAccessibility}
        comparisonAggregateAccessibility={comparisonAggregateAccessibility}
        weightByName={indicators.find(indicator => indicator.key === maskWeightsId).name}
        accessToName={indicators.find(indicator => indicator.key === analysis.grid).name} />}
    </div>
  }

  /**
   * Perform an authenticated fetch to get a presigned URL to download a grid from S3,
   * then download it. Pass in the path to fetch.
   */
  downloadFromS3 (url) {
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

  downloadScenarioGIS = (e) => {
    e.preventDefault()
    this.downloadFromS3(`/api/regional/${this.props.analysis.id}/grid/tiff?redirect=false`)
  }

  downloadComparisonGIS = (e) => {
    e.preventDefault()
    this.downloadFromS3(`/api/regional/${this.props.comparisonAnalysis.id}/grid/tiff?redirect=false`)
  }

  downloadProbabilityGIS = (e) => {
    e.preventDefault()
    // NB base comes first (TODO change?)
    this.downloadFromS3(`/api/regional/${this.props.comparisonAnalysis.id}/${this.props.analysis.id}/tiff?redirect=false`)
  }

  renderGisExport () {
    const { analysis, comparisonAnalysis } = this.props
    // we use <a> tags not buttons in order to get text wrapping; all event handlers prevent default
    return <div>
      <b><Icon type='map-o' />{messages.analysis.gisExport}</b>
      <ul>
        <li>
          <a onClick={this.downloadScenarioGIS} tabIndex={0}>
            {sprintf(messages.analysis.downloadRegional, analysis.name)}
          </a>
        </li>
        { comparisonAnalysis &&
          <li>
            <a onClick={this.downloadComparisonGIS} tabIndex={0}>
              {sprintf(messages.analysis.downloadRegional, comparisonAnalysis.name)}
            </a>
          </li> }
        { comparisonAnalysis &&
          <li>
            <a onClick={this.downloadProbabilityGIS} tabIndex={0}>
              {messages.analysis.downloadRegionalProbability}
            </a>
          </li> }
      </ul>
    </div>
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

    return <div>
      <h3>{analysis.name}</h3>

      {this.renderComparisonSelector()}

      {comparisonAnalysis &&
        <MinimumImprovementProbabilitySelector
          minimumImprovementProbability={minimumImprovementProbability}
          setMinimumImprovementProbability={setMinimumImprovementProbability}
          />
      }

      <div>
        <i>
          {analysis.travelTimePercentile !== -1 && sprintf(messages.analysis.accessTo, {
            opportunity: indicators.find(i => i.key === analysis.grid).name,
            cutoff: analysis.cutoffMinutes,
            percentile: analysis.travelTimePercentile
          })}
          {analysis.travelTimePercentile === -1 && sprintf(messages.analysis.accessToInstantaneous, {
            opportunity: indicators.find(i => i.key === analysis.grid).name,
            cutoff: analysis.cutoffMinutes
          })}
        </i>
      </div>

      { comparisonAnalysis && <div>
        <i>
          {comparisonAnalysis.travelTimePercentile !== -1 && sprintf(messages.analysis.comparisonAccessTo, {
            opportunity: indicators.find(i => i.key === comparisonAnalysis.grid).name,
            cutoff: comparisonAnalysis.cutoffMinutes,
            percentile: comparisonAnalysis.travelTimePercentile
          })}
          {comparisonAnalysis.travelTimePercentile === -1 && sprintf(messages.analysis.comparisonAccessToInstantaneous, {
            opportunity: indicators.find(i => i.key === comparisonAnalysis.grid).name,
            cutoff: comparisonAnalysis.cutoffMinutes
          })}
        </i>
      </div> }

      <Legend
        breaks={breaks}
        min={comparisonAnalysis != null
          ? differenceGrid.min
          : grid.min}
        colors={comparisonAnalysis != null
          ? colors.REGIONAL_COMPARISON_GRADIENT
          : colors.REGIONAL_GRADIENT}
        />

      <Collapsible
        title={sprintf(messages.analysis.settingsFor, analysis.name)}>
        <ProfileRequestDisplay request={analysis.request} />
      </Collapsible>

      { comparisonAnalysis && <Collapsible
        title={sprintf(messages.analysis.settingsFor, comparisonAnalysis.name)}>
        <ProfileRequestDisplay request={comparisonAnalysis.request} />
      </Collapsible> }

      {this.renderAggregation()}

      {this.renderGisExport()}
    </div>
  }

  componentWillUnmount () {
    const { removeRegionalAnalysisLayerFromMap, removeRegionalComparisonLayerFromMap } = this.props
    removeRegionalAnalysisLayerFromMap()
    removeRegionalComparisonLayerFromMap()
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
      onChange={(e) => setMinimumImprovementProbability(parseFloat(e.target.value))}
      />
  )
}
