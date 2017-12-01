// @flow
import lonlat from '@conveyal/lonlat'
import {Browser, LatLngBounds} from 'leaflet'
import React, {Component} from 'react'
import {Map as LeafletMap, TileLayer} from 'react-leaflet'

import {Button} from './buttons'
import {
  EDIT_REGION_BOUNDS_COMPONENT,
  ISOCHRONE_COMPONENT,
  OPPORTUNITY_COMPONENT,
  REGIONAL_COMPONENT,
  EDIT_REGIONAL_ANALYSIS_BOUNDS_COMPONENT,
  DESTINATION_TRAVEL_TIME_DISTRIBUTION_COMPONENT,
  AGGREGATION_AREA_COMPONENT,
  REGIONAL_ANALYSIS_SAMPLING_DISTRIBUTION_COMPONENT
} from '../constants/map'
import {CREATING_ID} from '../constants/region'
import EditRegionBounds from '../containers/edit-region-bounds'
import EditRegionalAnalysisBounds
  from '../containers/edit-regional-analysis-bounds'
import Modal, {ModalBody, ModalTitle} from './modal'
import ModificationsMap from '../containers/modifications-map'
import Isochrone from '../containers/isochrone'
import Regional from '../containers/regional-layer'
import Sidebar from './sidebar'
import DestinationTravelTimeDistribution
  from '../containers/destination-travel-time-distribution'
import AggregationArea from '../containers/aggregation-area'
import RegionalAnalysisSamplingDistribution
  from '../containers/regional-analysis-sampling-distribution'

import OpportunityDatasets from '../modules/opportunity-datasets'
import messages from '../utils/messages'

import type {Feature, LonLat} from '../types'

// prefer to use canvas for rendering, improves speed significantly
// http://leafletjs.com/reference.html#global
// with this on we might be able to get rid of the stop layer
window.L_PREFER_CANVAS = true

type DefaultProps = {
  variants: string[]
}

type Props = {
  bundleId: string,
  children: any,

  // actions
  clearError: () => void,
  loadRegion(_id: string): void,
  push(string): void,
  setMapCenter(LonLat): void,

  // state
  analysisMode: boolean,
  center: LonLat,
  error: string,
  errorMessage: string,
  hasError: boolean,
  hasProject: boolean,
  location: {
    pathname: string
  },
  mapComponents: any[],
  modificationBounds: LatLngBounds,
  regionId?: string,
  outstandingRequests: number,
  projectId?: string,
  projectIsLoaded: boolean,
  username: string,
  zoom: number
}

type State = {
  center: {lon: number, lat: number},
  zoom: number
}

const TILE_URL = Browser.retina && process.env.LEAFLET_RETINA_URL
  ? process.env.LEAFLET_RETINA_URL
  : process.env.LEAFLET_TILE_URL

export default class Application extends Component<DefaultProps, Props, State> {
  static defaultProps = {
    variants: ['Default']
  }

  state = {
    center: this.props.center,
    zoom: this.props.zoom
  }

  componentWillReceiveProps (nextProps: Props) {
    if (!lonlat.isEqual(nextProps.center, this.props.center)) {
      this.setState({
        center: nextProps.center
      })
    }

    if (nextProps.regionId &&
      this.props.regionId !== nextProps.regionId &&
      nextProps.regionId !== CREATING_ID) {
      this.props.loadRegion(nextProps.regionId)
    }
  }

  componentDidMount () {
    if (document.body) {
      document.body.classList.add('Editor')
    }

    const {loadRegion, regionId} = this.props
    if (regionId && regionId !== CREATING_ID) {
      loadRegion(regionId)
    }
  }

  componentWillUnmount () {
    if (document.body) {
      document.body.classList.remove('Editor')
    }
  }

  _setMapCenter = (feature: Feature) => {
    this.props.setMapCenter(lonlat(feature.geometry.coordinates))
  }

  render () {
    const {
      analysisMode,
      clearError,
      children,
      error,
      errorMessage,
      hasError,
      hasProject,
      location,
      mapComponents,
      modificationBounds,
      outstandingRequests,
      regionId,
      projectId,
      projectIsLoaded,
      username
    } = this.props
    const {center} = this.state

    return (
      <div id='editor'>
        <Sidebar
          currentPath={location.pathname}
          outstandingRequests={outstandingRequests}
          regionId={regionId}
          projectId={projectId}
          username={username}
        />
        {hasError &&
          <UiLock
            clearError={clearError}
            error={error}
            errorMessage={errorMessage}
          />}

        <div
          className={`Fullscreen ${analysisMode ? 'analysisMode' : ''}`}
        >
          <LeafletMap bounds={modificationBounds} center={center} zoom={12}>
            <TileLayer
              url={TILE_URL}
              attribution={process.env.LEAFLET_ATTRIBUTION}
              zIndex={-10}
            />

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
                case EDIT_REGIONAL_ANALYSIS_BOUNDS_COMPONENT:
                  return (
                    <EditRegionalAnalysisBounds key={`map-component-${i}`} />
                  )
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

            {process.env.LABEL_TILE_URL &&
              <TileLayer
                zIndex={40}
                url={
                  Browser.retina && process.env.LABEL_RETINA_URL
                    ? process.env.LABEL_RETINA_URL
                    : process.env.LABEL_TILE_URL
                }
              />}

            {/* Project should go on top of labels */}
            {hasProject && projectIsLoaded && <ModificationsMap zIndex={50} />}
          </LeafletMap>
        </div>

        <div
          className={`ApplicationDock ${analysisMode ? 'analysisMode' : ''}`}
        >
          {children}
        </div>
      </div>
    )
  }
}

function UiLock ({clearError, error, errorMessage}) {
  return (
    <Modal onRequestClose={clearError}>
      <ModalTitle>{messages.errorModal.title}</ModalTitle>
      <ModalBody>
        <p><strong>{error}</strong></p>
        <p><strong>{errorMessage}</strong></p>
        <br />
      </ModalBody>
      <ModalBody>
        <p><em>
          Email a screenshot of your browser window and a description of what you were doing to
          {' '}
          <a href='mailto:analysis@conveyal.com' title='Conveyal Support'>
            analysis@conveyal.com
          </a> to submit an error report.
        </em></p>
        <ul>
          <li>
            <a href='https://support.apple.com/en-us/HT201361' target='_blank'>
              How to take a screenshot on a Mac
            </a>
          </li>
          <li>
            <a
              href='https://www.howtogeek.com/226280/how-to-take-screenshots-in-windows-10/'
              target='_blank'
            >
              How to take a screenshot on a PC
            </a>
          </li>
        </ul>
        <br />
        <p>
          <Button
            block
            onClick={() => {
              clearError()
              window.history.back()
            }}
            style='danger'
          >
            Close this window
          </Button>
        </p>
      </ModalBody>
    </Modal>
  )
}
