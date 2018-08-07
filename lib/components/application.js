// @flow
import React, {Component} from 'react'

import {
  EDIT_REGION_BOUNDS_COMPONENT,
  ISOCHRONE_COMPONENT,
  OPPORTUNITY_COMPONENT,
  REGIONAL_COMPONENT,
  DESTINATION_TRAVEL_TIME_DISTRIBUTION_COMPONENT,
  AGGREGATION_AREA_COMPONENT,
  REGIONAL_ANALYSIS_SAMPLING_DISTRIBUTION_COMPONENT
} from '../constants/map'
import {CREATING_ID} from '../constants/region'
import EditRegionBounds from '../containers/edit-region-bounds'
import ModificationsMap from '../containers/modifications-map'
import Isochrone from '../containers/isochrone'
import Regional from '../containers/regional-layer'
import Sidebar from './sidebar'
import DestinationTravelTimeDistribution
  from '../containers/destination-travel-time-distribution'
import AggregationArea from '../containers/aggregation-area'
import RegionalAnalysisSamplingDistribution
  from '../containers/regional-analysis-sampling-distribution'

import ErrorModal from './error-modal'
import Map from './map'
import LabelLayer from './map/label-layer'
import OpportunityDatasets from '../modules/opportunity-datasets'

type Props = {
  children: any,

  // actions
  loadRegion(_id: string): void,

  // state
  hasProject: boolean,
  mapComponents: any[],
  regionId?: string,
  projectId?: string,
  projectIsLoaded: boolean,
}

export default class Application extends Component<void, Props, void> {
  componentWillReceiveProps (nextProps: Props) {
    if (nextProps.regionId &&
      this.props.regionId !== nextProps.regionId &&
      nextProps.regionId !== CREATING_ID) {
      this.props.loadRegion(nextProps.regionId)
    }
  }

  componentDidMount () {
    const {loadRegion, regionId} = this.props
    if (regionId && regionId !== CREATING_ID) {
      loadRegion(regionId)
    }
  }

  render () {
    const {
      children,
      hasProject,
      mapComponents,
      regionId,
      projectIsLoaded
    } = this.props

    return (
      <div id='editor'>
        <Sidebar />
        <ErrorModal />

        <div className='Fullscreen'>
          <Map>
            {mapComponents.map((type, i) => {
              switch (type) {
                case EDIT_REGION_BOUNDS_COMPONENT:
                  return (
                    <EditRegionBounds
                      key={`map-component-${i}`}
                      regionId={regionId}
                    />
                  )
                case ISOCHRONE_COMPONENT:
                  return <Isochrone zIndex={30} key={`map-component-${i}`} />
                case OPPORTUNITY_COMPONENT:
                  return <OpportunityDatasets.components.DotMap key={`map-component-${i}`} />
                case REGIONAL_COMPONENT:
                  return <Regional key={`map-component-${i}`} />
                case DESTINATION_TRAVEL_TIME_DISTRIBUTION_COMPONENT:
                  return (
                    <DestinationTravelTimeDistribution
                      key={`map-component-${i}`}
                    />
                  )
                case AGGREGATION_AREA_COMPONENT:
                  return <AggregationArea key={`map-component-${i}`} />
                case REGIONAL_ANALYSIS_SAMPLING_DISTRIBUTION_COMPONENT:
                  return (
                    <RegionalAnalysisSamplingDistribution
                      key={`map-component-${i}`}
                    />
                  )
              }
            })}

            <LabelLayer />

            {/* Project should go on top of labels */}
            {hasProject && projectIsLoaded && <ModificationsMap zIndex={50} />}
          </Map>
        </div>

        <div className='ApplicationDock'>
          {children}
        </div>
      </div>
    )
  }
}
