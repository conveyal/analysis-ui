import {faSpinner} from '@fortawesome/free-solid-svg-icons'
import React, {Component} from 'react'

import message from 'lib/message'
import OpportunityDatasets from 'lib/modules/opportunity-datasets'

import Select from '../select'
import {Button} from '../buttons'
import Icon from '../icon'
import colors from '../../constants/colors'
import {Group, Text, File} from '../input'

import ProfileRequestDisplay from './profile-request-display'
import Legend from './legend'
import AggregateAccessibility from './aggregate-accessibility'

const REGIONAL_URL = `${process.env.API_URL}/regional`

/** render a regional analysis */
export default class RegionalResults extends Component {
  state = {
    aggregationAreaFiles: null,
    aggregationAreaName: null,
    showAggregationAreaUpload: false
  }

  componentDidMount() {
    this.props.loadRegionalAnalysisGrids({_id: this.props.analysisId})
  }

  selectComparisonAnalysis = chosen => {
    const ids = {_id: this.props.analysisId, comparisonId: undefined}
    if (chosen != null) ids.comparisonId = chosen.value

    this.props.setActiveRegionalAnalysis(ids)
    this.props.loadRegionalAnalysisGrids(ids)
  }

  selectAggregationArea = e => {
    const {regionId, setAggregationArea} = this.props

    if (e) {
      if (e.value === 'new-aggregation-area') {
        this.setState({showAggregationAreaUpload: true})
      } else {
        setAggregationArea({regionId, aggregationAreaId: e.value})
      }
    } else {
      setAggregationArea()
    }
  }

  renderComparisonSelector() {
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
      <Group label={message('analysis.compareTo')}>
        <Select
          value={comparisonAnalysis ? comparisonAnalysis._id : null}
          options={options}
          onChange={this.selectComparisonAnalysis}
        />
      </Group>
    )
  }

  /** Called when editing the new aggregation area name */
  changeAggregationAreaName = e =>
    this.setState({aggregationAreaName: e.target.value})

  /** Called when selecting files to upload */
  changeAggregationAreaFiles = e => {
    this.setState({aggregationAreaFiles: e.target.files})
  }

  uploadAggregationArea = e => {
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
  renderAggregation() {
    const {
      aggregationAreas,
      aggregationAreaId,
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
      label: message('analysis.newAggregationArea'),
      value: 'new-aggregation-area' // IDs of aggregation areas are UUIDs so this will not conflict
    })

    return (
      <div>
        <Group label={message('analysis.aggregateTo')}>
          <Select
            name='aggregateTo'
            options={aggregationAreaOptions}
            value={aggregationAreaId}
            onChange={this.selectAggregationArea}
          />
        </Group>

        {showAggregationAreaUpload && (
          <form onSubmit={this.uploadAggregationArea}>
            <Group label={message('analysis.aggregationAreaName')}>
              <Text
                name='Name'
                value={aggregationAreaName}
                onChange={this.changeAggregationAreaName}
              />
            </Group>

            <Group label={message('analysis.aggregationAreaFiles')}>
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
              value={message('analysis.uploadAggregationArea')}
            />
          </form>
        )}

        {aggregationAreaId && (
          <Group label={message('analysis.weightBy')}>
            <OpportunityDatasets.components.Selector />
          </Group>
        )}

        {aggregationAreaUploading && (
          <span>
            <Icon icon={faSpinner} spin />
            &nbsp;{message('analysis.uploading')}
          </span>
        )}

        {analysis && aggregateAccessibility && aggregationWeightsId && (
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
              comparisonAnalysis ? comparisonAnalysis.name : ''
            }
          />
        )}
      </div>
    )
  }

  /**
   * Perform an authenticated fetch to get a presigned URL to download a grid from S3,
   * then download it. Pass in the path to fetch.
   */
  downloadFromS3(url) {
    this.props.fetch({
      url,
      next(response) {
        window.open(response.value.url)
      }
    })
  }

  downloadProjectGIS = e => {
    e.preventDefault()
    if (this.props.analysis) {
      this.downloadFromS3(
        `${REGIONAL_URL}/${this.props.analysis._id}/grid/tiff?redirect=false`
      )
    } else {
      throw new Error('Attempt to dowload analysis that has not yet loaded!')
    }
  }

  downloadComparisonGIS = e => {
    e.preventDefault()
    if (this.props.comparisonAnalysis) {
      this.downloadFromS3(
        `${REGIONAL_URL}/${
          this.props.comparisonAnalysis._id
        }/grid/tiff?redirect=false`
      )
    } else {
      throw new Error(
        'Attempt to dowload comparison analysis that has not yet loaded!'
      )
    }
  }

  render() {
    const {
      analysis,
      breaks,
      comparisonAnalysis,
      differenceGrid,
      grid
    } = this.props

    return (
      <div>
        {this.renderComparisonSelector()}

        {comparisonAnalysis && (
          <div>
            {analysis.workerVersion !== comparisonAnalysis.workerVersion && (
              <div className='alert alert-danger'>
                {message('r5Version.comparisonIsDifferent')}
              </div>
            )}

            <ProfileRequestDisplay
              {...comparisonAnalysis}
              {...comparisonAnalysis.request}
            />
          </div>
        )}

        <p>
          {analysis.travelTimePercentile !== -1 &&
            message('analysis.accessTo', {
              opportunity: this.findOpportunityDatasetName(analysis.grid),
              cutoff: analysis.cutoffMinutes,
              percentile: analysis.travelTimePercentile
            })}
          {analysis.travelTimePercentile === -1 &&
            message('analysis.accessToInstantaneous', {
              opportunity: this.findOpportunityDatasetName(analysis.grid),
              cutoff: analysis.cutoffMinutes
            })}
        </p>

        {comparisonAnalysis && (
          <p>
            {comparisonAnalysis.travelTimePercentile !== -1 &&
              message('analysis.comparisonAccessTo', {
                opportunity: this.findOpportunityDatasetName(
                  comparisonAnalysis.grid
                ),
                cutoff: comparisonAnalysis.cutoffMinutes,
                percentile: comparisonAnalysis.travelTimePercentile
              })}
            {comparisonAnalysis.travelTimePercentile === -1 &&
              message('analysis.comparisonAccessToInstantaneous', {
                opportunity: this.findOpportunityDatasetName(
                  comparisonAnalysis.grid
                ),
                cutoff: comparisonAnalysis.cutoffMinutes
              })}
          </p>
        )}

        {grid ? (
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
        ) : (
          <p>Loading grids...</p>
        )}

        {this.renderAggregation()}

        <Group label={message('analysis.gisExport')}>
          <Button block onClick={this.downloadProjectGIS} style='info'>
            {message('analysis.downloadRegional', {name: analysis.name})}
          </Button>
          {comparisonAnalysis && (
            <Button block onClick={this.downloadComparisonGIS} style='info'>
              {message('analysis.downloadRegional', {
                name: comparisonAnalysis.name
              })}
            </Button>
          )}
        </Group>
      </div>
    )
  }

  // TODO replace with selector
  findOpportunityDatasetName(_id) {
    const value = this.props.opportunityDatasets.find(i => i._id === _id)
    return value != null ? value.name : _id
  }
}
