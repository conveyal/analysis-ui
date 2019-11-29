import {faExclamationTriangle} from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import {scaleLinear} from 'd3-scale'
import {format as d3Format} from 'd3-format'

import colors from 'lib/constants/colors'
import message from 'lib/message'

import Icon from '../icon'
import {Slider} from '../input'
import P from '../p'
import * as Panel from '../panel'

const WIDTH = 290
const HEIGHT = 225
const X_SCALE_HEIGHT = 30
const Y_SCALE_WIDTH = 30
const FONT_SIZE = 10

/**
 * Percentile of aggregate accessibility to display. Note that this is inverted
 * from what most people might expect; the 90th percentile of accessibility
 * means that 10% of the population has access to this mean jobs (assuming you
 * are using population-weighted job accessibility).
 */
const PERCENTILE_OF_ACCESSIBILITY = 10

/**
 * This component renders the aggregate accessibility display (histograms and percentiles).
 */
export default class AggregateAccessibilityComponent extends React.Component {
  state = {
    percentileOfAccessibility: PERCENTILE_OF_ACCESSIBILITY
  }

  static getDerivedStateFromProps(props) {
    return {
      xScale: createXScale(props),
      yScale: createYScale(props)
    }
  }

  setPercentileOfAccessibility = e => {
    this.setState({percentileOfAccessibility: e.target.value})
  }

  percentiles() {
    const {aggregateAccessibility} = this.props
    const {percentileOfAccessibility} = this.state
    return aggregateAccessibility.percentiles[percentileOfAccessibility]
  }

  comparisonPercentiles() {
    const accessibility = this.props.comparisonAggregateAccessibility
    const {percentileOfAccessibility} = this.state
    return accessibility
      ? accessibility.percentiles[percentileOfAccessibility]
      : 0
  }

  render() {
    const {
      accessToName,
      aggregateAccessibility,
      comparisonAccessToName,
      comparisonAggregateAccessibility,
      comparisonRegionalAnalysisName,
      regionalAnalysisName,
      weightByName
    } = this.props
    const {percentileOfAccessibility, xScale, yScale} = this.state
    return (
      <>
        <svg width={WIDTH} height={HEIGHT}>
          <Bins
            bins={aggregateAccessibility.bins}
            breakPoint={this.percentiles()}
            color={colors.PROJECT_PERCENTILE_COLOR}
            xScale={xScale}
            yScale={yScale}
          />
          <XScale xScale={xScale} />
          <YScale weightByName={weightByName} yScale={yScale} />
          <PercentileLine
            color={colors.PROJECT_PERCENTILE_COLOR}
            x={xScale(this.percentiles())}
          />
          {comparisonAggregateAccessibility && (
            <>
              <Bins
                bins={comparisonAggregateAccessibility.bins}
                breakPoint={this.comparisonPercentiles()}
                color={colors.COMPARISON_PERCENTILE_COLOR}
                xScale={xScale}
                yScale={yScale}
              />
              <PercentileLine
                color={colors.COMPARISON_PERCENTILE_COLOR}
                x={xScale(this.comparisonPercentiles())}
              />
            </>
          )}
        </svg>
        <Slider
          label={message('analysis.selectPercentileOfAccessibility')}
          width={WIDTH - Y_SCALE_WIDTH}
          min={1}
          max={99}
          step={1}
          value={percentileOfAccessibility}
          onChange={this.setPercentileOfAccessibility}
          style={{left: Y_SCALE_WIDTH}}
        />

        <AggregateAccessibilityReadout
          name={regionalAnalysisName}
          weightByName={weightByName}
          accessToName={accessToName}
          // invert: 90th percentile of accessibility means accessibility that
          // high or greater is experienced by 10% of the population
          percentage={100 - percentileOfAccessibility}
          accessibilityForPercentile={this.percentiles()}
          weightedAverage={aggregateAccessibility.weightedAverage}
        />

        {comparisonAggregateAccessibility && (
          <AggregateAccessibilityReadout
            name={comparisonRegionalAnalysisName}
            weightByName={weightByName}
            accessToName={comparisonAccessToName}
            // invert: 90th percentile of accessibility means accessibility that
            // high or greater is experienced by 10% of the population
            percentage={100 - percentileOfAccessibility}
            accessibilityForPercentile={this.comparisonPercentiles()}
            weightedAverage={comparisonAggregateAccessibility.weightedAverage}
          />
        )}

        <div className='alert alert-warning'>
          <Icon icon={faExclamationTriangle} />
          <span>
            {' '}
            {message('analysis.weightedAverageAccessibilityWarning')}
          </span>
        </div>
      </>
    )
  }
}

function Bins({
  bins,
  breakPoint, // where we break between the gray and colored plot
  color,
  xScale,
  yScale
}) {
  return (
    <>
      {bins.map(({min, max, value}, i) => {
        if (max < breakPoint || min > breakPoint) {
          // normal bar, all one color
          return (
            <rect
              x={xScale(min)}
              width={xScale(max) - xScale(min)}
              y={yScale(value)}
              height={yScale(0) - yScale(value)}
              style={{
                fill: min > breakPoint ? color : colors.STALE_PERCENTILE_COLOR,
                fillOpacity: 0.5
              }}
              key={`bin-${i}`}
            />
          )
        } else {
          // part of this bar is above the cutoff percentile, part below, so render two bars
          return (
            <React.Fragment key={`bin-${i}.`}>
              <rect
                x={xScale(min)}
                width={xScale(breakPoint) - xScale(min)}
                y={yScale(value)}
                height={yScale(0) - yScale(value)}
                style={{
                  fill: colors.STALE_PERCENTILE_COLOR,
                  fillOpacity: 0.5
                }}
              />
              <rect
                x={xScale(breakPoint)}
                width={xScale(max) - xScale(breakPoint)}
                y={yScale(value)}
                height={yScale(0) - yScale(value)}
                style={{fill: color, fillOpacity: 0.5}}
              />
            </React.Fragment>
          )
        }
      })}
    </>
  )
}

/**
 * Render a vertical line at the chosen percentile of accessibility
 */
function PercentileLine({color, x}) {
  return (
    <line
      x1={x}
      x2={x}
      y1={0}
      y2={HEIGHT - X_SCALE_HEIGHT}
      style={{stroke: color, strokeWidth: 0.5}}
    />
  )
}

function AggregateAccessibilityReadout({
  name,
  weightByName,
  accessToName,
  percentage,
  accessibilityForPercentile,
  weightedAverage
}) {
  const fmt = d3Format(',')
  return (
    <Panel.Panel>
      <Panel.Heading>{name}</Panel.Heading>
      <Panel.Body>
        <P>
          {message('analysis.percentileOfAccessibility', {
            name,
            weightByName,
            accessToName,
            // invert: 90th percentile of accessibility means accessibility that high or greater is
            // experienced by 10% of the population
            percentage,
            accessibility: fmt(Math.round(accessibilityForPercentile))
          })}
        </P>

        <P>
          {message('analysis.weightedAverageAccessibility', {
            weightedAverage: fmt(Math.round(weightedAverage))
          })}
        </P>
      </Panel.Body>
    </Panel.Panel>
  )
}

function createXScale(props) {
  const {aggregateAccessibility, comparisonAggregateAccessibility} = props

  const minAccessibility = comparisonAggregateAccessibility
    ? Math.min(
        comparisonAggregateAccessibility.minAccessibility,
        aggregateAccessibility.minAccessibility
      )
    : aggregateAccessibility.minAccessibility

  const maxAccessibility = comparisonAggregateAccessibility
    ? Math.max(
        comparisonAggregateAccessibility.maxAccessibility,
        aggregateAccessibility.maxAccessibility
      )
    : aggregateAccessibility.maxAccessibility

  return scaleLinear()
    .domain([minAccessibility, maxAccessibility])
    .range([Y_SCALE_WIDTH, WIDTH])
}

function createYScale(props) {
  const {aggregateAccessibility, comparisonAggregateAccessibility} = props

  const maxCount = comparisonAggregateAccessibility
    ? Math.max(
        ...[
          ...aggregateAccessibility.bins.map(b => b.value),
          ...comparisonAggregateAccessibility.bins.map(b => b.value)
        ]
      )
    : Math.max(...aggregateAccessibility.bins.map(b => b.value))

  return scaleLinear()
    .domain([0, maxCount])
    .range([HEIGHT - X_SCALE_HEIGHT, 0]) // invert y, +y is down in SVG
}

function XScale({xScale}) {
  const fmt = d3Format('.3s')
  return (
    <>
      {xScale.ticks(4).map((t, i) => (
        <text
          x={xScale(t)}
          y={HEIGHT - FONT_SIZE * 1.5}
          style={{
            textAnchor: 'middle',
            alignmentBaseline: 'baseline',
            fontSize: FONT_SIZE
          }}
          key={`x-label-${i}`}
        >
          {fmt(t)}
        </text>
      ))}
      <text
        x={WIDTH / 2}
        y={HEIGHT}
        style={{
          textAnchor: 'middle',
          alignmentBaseline: 'ideographic',
          fontSize: FONT_SIZE
        }}
      >
        {message('analysis.accessibility')}
      </text>
    </>
  )
}

function YScale({weightByName, yScale}) {
  const fmt = d3Format('.3s')
  return (
    <>
      {yScale.ticks(4).map((t, i) => (
        <text
          y={0}
          x={0}
          key={`y-label-${i}`}
          style={{
            textAnchor: 'right',
            alignmentBaseline: 'middle',
            fontSize: FONT_SIZE
          }}
          transform={`translate(${Y_SCALE_WIDTH} ${yScale(t)}) rotate(-30)`}
        >
          {fmt(t)}
        </text>
      ))}
      <text
        x={0}
        y={0}
        transform={`translate(${FONT_SIZE * 0.75} ${HEIGHT / 2}) rotate(-90)`}
        style={{
          textAnchor: 'middle',
          alignmentBaseline: 'middle',
          fontSize: FONT_SIZE
        }}
      >
        {weightByName}
      </text>
    </>
  )
}
