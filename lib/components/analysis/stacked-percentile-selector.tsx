import {color} from 'd3-color'
import {format} from 'd3-format'
import {useState} from 'react'
import {useSelector} from 'react-redux'

import message from 'lib/message'
import colors from 'lib/constants/colors'
import {UNDEFINED_PROJECT_NAME} from 'lib/constants'
import {activeOpportunityDataset} from 'lib/modules/opportunity-datasets/selectors'

import selectDisplayedComparisonScenarioName from 'lib/selectors/displayed-comparison-scenario-name'
import selectDisplayedScenarioName from 'lib/selectors/displayed-scenario-name'
import selectAccessibility from 'lib/selectors/accessibility'
import selectComparisonAccessibility from 'lib/selectors/comparison-accessibility'
import selectComparisonInProgress from 'lib/selectors/comparison-in-progress'
import selectComparisonPercentileCurves from 'lib/selectors/comparison-percentile-curves'
import selectMaxTripDurationMinutes from 'lib/selectors/max-trip-duration-minutes'
import selectPercentileCurves from 'lib/selectors/percentile-curves'
import selectMaxAccessibility from 'lib/selectors/max-accessibility'
import selectNearestPercentile from 'lib/selectors/nearest-percentile'

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
  const projectName = useSelector(selectDisplayedScenarioName)
  const comparisonProjectName = useSelector(
    selectDisplayedComparisonScenarioName
  )
  const opportunityDataset = useSelector(activeOpportunityDataset)
  const accessibility = useSelector(selectAccessibility)
  const comparisonAccessibility = useSelector(selectComparisonAccessibility)
  const comparisonInProgress = useSelector(selectComparisonInProgress)
  const comparisonPercentileCurves = useSelector(
    selectComparisonPercentileCurves
  )
  const isochroneCutoff = useSelector(selectMaxTripDurationMinutes)
  const percentileCurves = useSelector(selectPercentileCurves)
  const maxAccessibility = useSelector(selectMaxAccessibility)
  const nearestPercentile = useSelector(selectNearestPercentile)
  const opportunityDatasetName = opportunityDataset && opportunityDataset.name

  const [scenarioPlotted, setScenarioPlotted] = useState(PROJECT)
  if (accessibility == null) return null

  const noComparison =
    !comparisonProjectName && comparisonProjectName !== UNDEFINED_PROJECT_NAME

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
            {opportunityDatasetName ||
              `[${message('analysis.selectOpportunityDataset')}]`}
          </strong>{' '}
          in <strong>{isochroneCutoff}</strong> minutes (travel time percentile:{' '}
          <strong>{nearestPercentile}</strong>th)
        </P>
      )}

      <div className='progress' style={{marginBottom: '4px'}}>
        <div
          className='progress-bar'
          role='progressbar'
          style={{
            backgroundColor: colorBar.toString(),
            minWidth: '3em',
            width: `${((accessibility || 1) / maxAccessibility) * 100}%`
          }}
        >
          {commaFormat(accessibility)}
        </div>
      </div>

      {comparisonInProgress &&
        comparisonProjectName &&
        comparisonAccessibility != null && (
          <div className='progress' style={{marginBottom: '4px'}}>
            <div
              className='progress-bar'
              role='progressbar'
              style={{
                backgroundColor: comparisonColorBar.toString(),
                minWidth: '3em',
                width: `${(comparisonAccessibility / maxAccessibility) * 100}%`
              }}
            >
              {commaFormat(comparisonAccessibility)}
            </div>
          </div>
        )}

      {comparisonAccessibility !== null && (
        <ButtonGroup justified>
          <Button
            active={noComparison || scenarioPlotted === PROJECT}
            disabled={noComparison}
            onClick={() => setScenarioPlotted(PROJECT)}
            size='sm'
            value={PROJECT}
          >
            {projectName}
          </Button>
          <Button
            active={!noComparison && scenarioPlotted === BASE}
            disabled={noComparison}
            onClick={() => setScenarioPlotted(BASE)}
            size='sm'
          >
            {comparisonProjectName || 'No comparison selected'}
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

      {percentileCurves && (
        <StackedPercentile
          percentileCurves={percentileCurves}
          comparisonPercentileCurves={comparisonPercentileCurves}
          width={GRAPH_WIDTH}
          height={GRAPH_HEIGHT}
          isochroneCutoff={isochroneCutoff}
          opportunityDatasetName={opportunityDatasetName}
          textColor={'#333333'}
          color={projectColor}
          comparisonColor={comparisonColor}
          maxAccessibility={maxAccessibility}
          selected={comparisonPercentileCurves ? scenarioPlotted : PROJECT}
          label={projectName}
          comparisonLabel={comparisonProjectName}
        />
      )}
    </>
  )
}
