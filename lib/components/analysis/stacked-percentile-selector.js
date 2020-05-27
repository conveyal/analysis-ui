import {color} from 'd3-color'
import {format} from 'd3-format'
import React, {useState} from 'react'

import message from 'lib/message'
import colors from 'lib/constants/colors'
import {UNDEFINED_PROJECT_NAME} from 'lib/constants'

import {Button, Group as ButtonGroup} from '../buttons'
import P from '../p'

import StackedPercentile, {
  PROJECT,
  BASE,
  COMPARISON
} from './stacked-percentile'

const GRAPH_HEIGHT = 300
const GRAPH_WIDTH = 600

const commaFormat = format(',d')

/**
 * A component allowing toggling between up to two stacked percentile plots and
 * comparisons of said
 */
export default function StackedPercentileSelector(p) {
  const [scenarioPlotted, setScenarioPlotted] = useState(PROJECT)
  if (p.accessibility == null) return null

  const noComparison =
    !p.comparisonProjectName &&
    p.comparisonProjectName !== UNDEFINED_PROJECT_NAME

  const projectColor =
    p.disabled || p.stale
      ? colors.STALE_PERCENTILE_COLOR
      : colors.PROJECT_PERCENTILE_COLOR
  const comparisonColor =
    p.disabled || p.stale
      ? colors.STALE_PERCENTILE_COLOR
      : colors.COMPARISON_PERCENTILE_COLOR

  const colorBar = color(projectColor)
  colorBar.opacity = 0.3
  const comparisonColorBar = color(comparisonColor)
  comparisonColorBar.opacity = 0.3

  return (
    <>
      {p.stale ? (
        <P>{message('analysis.willUpdate')}</P>
      ) : (
        <P>
          {message('analysis.accessibilityTo')}{' '}
          <strong>
            {p.opportunityDatasetName ||
              `[${message('analysis.selectOpportunityDataset')}]`}
          </strong>{' '}
          in <strong>{p.isochroneCutoff}</strong> minutes (travel time
          percentile: <strong>{p.nearestPercentile}</strong>th)
        </P>
      )}

      <div className='progress' style={{marginBottom: '4px'}}>
        <div
          className='progress-bar'
          role='progressbar'
          style={{
            backgroundColor: colorBar.toString(),
            minWidth: '3em',
            width: `${((p.accessibility || 1) / p.maxAccessibility) * 100}%`
          }}
        >
          {commaFormat(p.accessibility)}
        </div>
      </div>

      {p.comparisonInProgress &&
        p.comparisonProjectName &&
        p.comparisonAccessibility != null && (
          <div className='progress' style={{marginBottom: '4px'}}>
            <div
              className='progress-bar'
              role='progressbar'
              style={{
                backgroundColor: comparisonColorBar.toString(),
                minWidth: '3em',
                width: `${
                  (p.comparisonAccessibility / p.maxAccessibility) * 100
                }%`
              }}
            >
              {commaFormat(p.comparisonAccessibility)}
            </div>
          </div>
        )}

      {p.comparisonAccessibility !== null && (
        <ButtonGroup justified>
          <Button
            active={noComparison || scenarioPlotted === PROJECT}
            disabled={noComparison}
            onClick={() => setScenarioPlotted(PROJECT)}
            size='sm'
            value={PROJECT}
          >
            {p.projectName}
          </Button>
          <Button
            active={!noComparison && scenarioPlotted === BASE}
            disabled={noComparison}
            onClick={() => setScenarioPlotted(BASE)}
            size='sm'
          >
            {p.comparisonProjectName || 'No comparison selected'}
          </Button>
          <Button
            active={!noComparison && scenarioPlotted === COMPARISON}
            disabled={noComparison}
            onClick={() => setScenarioPlotted(COMPARISON)}
            size='sm'
          >
            {message('analysis.comparison')}
          </Button>
        </ButtonGroup>
      )}

      {p.percentileCurves && (
        <StackedPercentile
          percentileCurves={p.percentileCurves}
          comparisonPercentileCurves={p.comparisonPercentileCurves}
          width={GRAPH_WIDTH}
          height={GRAPH_HEIGHT}
          isochroneCutoff={p.isochroneCutoff}
          opportunityDatasetName={p.opportunityDatasetName}
          textColor={'#333333'}
          color={projectColor}
          comparisonColor={comparisonColor}
          maxAccessibility={p.maxAccessibility}
          selected={p.comparisonPercentileCurves ? scenarioPlotted : PROJECT}
          label={p.projectName}
          comparisonLabel={p.comparisonProjectName}
        />
      )}
    </>
  )
}
