// @flow
import Icon from '@conveyal/woonerf/components/icon'
import message from '@conveyal/woonerf/message'
import React from 'react'

import {Button} from '../buttons'

type Props = {
  abortFetchTravelTimeSurface: () => void,
  createRegionalAnalysis: () => void,
  disableCreateRegionalAnalysis: boolean,
  disableFetchTravelTimeSurface: boolean,
  fetchTravelTimeSurface: () => void,
  isochroneFetchStatus: false | string
}

export default function AnalysisTitle (p: Props) {
  const isFetchingIsochrone = !!p.isochroneFetchStatus
  return (
    <div className='ApplicationDockTitle'>
      <Icon type='area-chart' />{' '}
      {isFetchingIsochrone
        ? p.isochroneFetchStatus
        : 'Analysis'}

      {isFetchingIsochrone &&
        <Button
          className='pull-right'
          onClick={p.abortFetchTravelTimeSurface}
          style='danger'
        >
          <Icon type='close' /> Abort
        </Button>}

      {!isFetchingIsochrone &&
        <Button
          className='pull-right'
          disabled={p.disableFetchTravelTimeSurface}
          onClick={p.fetchTravelTimeSurface}
          style='primary'
          title={p.disableFetchTravelTimeSurface
            ? message('analysis.disableFetch')
            : ''}
        >
          <Icon type='refresh' /> {message('analysis.refresh')}
        </Button>}

      {!isFetchingIsochrone &&
        <Button
          className='pad-right pull-right'
          disabled={p.disableCreateRegionalAnalysis}
          style='success'
          onClick={p.createRegionalAnalysis}
          title={p.disableCreateRegionalAnalysis
            ? message('analysis.disableRegionalAnalysis')
            : ''}
        >
          <Icon type='plus' />
          {message('analysis.newRegionalAnalysis')}
        </Button>}
    </div>
  )
}
