// @flow
import Icon from '@conveyal/woonerf/components/icon'
import Pure from '@conveyal/woonerf/components/pure'
import isEqual from 'lodash/isEqual'
import React from 'react'
import Select from 'react-select'

import {Group} from '../input'
import {Button} from '../buttons'
import messages from '../../utils/messages'

import type {Bookmark, LonLat, Modification, ProfileRequest} from '../../types'

type Props = {
  bookmarks: Bookmark[],
  bundleId: string,
  isochroneLonLat?: LonLat,
  isFetchingIsochrone: boolean,
  profileRequest: ProfileRequest,
  projectBounds: {},
  projectId: string,
  comparisonInProgress: boolean,
  comparisonScenarioId: string,
  comparisonVariant: number,
  comparisonModifications: Modification[],
  comparisonIsochrone: {},
  comparisonBundleId: string,
  currentIndicator: string,
  isochroneCutoff: number,
  modifications: Modification[],
  scenarioId: string,
  variantIndex: number,
  workerVersion: string,

  createBookmark(): void,
  fetchTravelTimeSurface(): void,
  selectBookmark(Bookmark): void,
  setCurrentIndicator(): void,
  setIsochroneCutoff(): void
}

export default class BookmarkChooser extends Pure {
  props: Props

  selectBookmark = (e: {value: string}) => {
    const {
      bookmarks,
      comparisonInProgress,
      comparisonScenarioId,
      comparisonVariant,
      comparisonModifications,
      comparisonBundleId,
      bundleId,
      projectId,
      projectBounds,
      workerVersion,
      modifications,
      scenarioId,
      variantIndex,

      fetchTravelTimeSurface,
      selectBookmark,
      setCurrentIndicator,
      setIsochroneCutoff
    } = this.props

    const bookmark = bookmarks.find(b => b.id === e.value)

    if (bookmark) {
      const {profileRequest, isochroneCutoff, destinationGrid} = bookmark

      const commonParams = {
        workerVersion,
        projectId,
        bundleId,
        profileRequest
      }

      const scenario = {
        ...commonParams,
        scenarioId,
        variantIndex,
        modifications,
        bundleId
      }

      const comparison = !comparisonInProgress
        ? null
        : {
          ...commonParams,
          scenarioId: comparisonScenarioId,
          variantIndex: comparisonVariant,
          modifications: comparisonModifications,
          bundleId: comparisonBundleId
        }

      fetchTravelTimeSurface({scenario, comparison, bounds: projectBounds})
      setIsochroneCutoff(isochroneCutoff)
      setCurrentIndicator({projectId, indicator: destinationGrid})
      selectBookmark(bookmark)
    }
  }

  _createBookmark = () => {
    const {
      bookmarks,
      currentIndicator,
      isochroneLonLat,
      isochroneCutoff,
      profileRequest,
      createBookmark,
      projectId
    } = this.props
    const bookmarkName = window.prompt('Enter a name for your bookmark', `Bookmark ${bookmarks.length + 1}`)

    if (bookmarkName && bookmarkName.length > 0 && isochroneLonLat) {
      const {lat, lon} = isochroneLonLat

      createBookmark({
        name: bookmarkName,
        profileRequest: {
          ...profileRequest,
          fromLat: lat,
          fromLon: lon
        },
        destinationGrid: currentIndicator,
        isochroneCutoff,
        projectId
      })
    }
  }

  render () {
    const {
      bookmarks,
      profileRequest,
      isochroneCutoff,
      isochroneLonLat,
      isFetchingIsochrone,
      currentIndicator
    } = this.props
    const options = bookmarks
      .sort((a, b) => {
        if (a.name === b.name) return 0
        else if (a.name == null) return -1
        else if (b.name == null) return 1
        else return a.name.localeCompare(b.name)
      })
      .map(b => ({
        label: b.name,
        value: b.id
      }))

    const selectedBookmark = isochroneLonLat
      ? bookmarks.find(
          b =>
            Math.abs(b.profileRequest.fromLon - isochroneLonLat.lon) < 1e-8 &&
            Math.abs(b.profileRequest.fromLat - isochroneLonLat.lat) < 1e-8 &&
            currentIndicator === b.destinationGrid &&
            isochroneCutoff === b.isochroneCutoff &&
            isEqual(b.profileRequest, profileRequest)
        )
      : null

    return (
      <Group label={messages.analysis.bookmark}>
        <div className='row'>
          <div className='col-xs-6'>
            <Select
              options={options}
              disabled={isFetchingIsochrone} // don't allow users to reselect bookmarks while their bookmark is loading
              value={selectedBookmark && selectedBookmark.id}
              onChange={this.selectBookmark}
            />
          </div>
          <div className='col-xs-6'>
            <Button
              block
              disabled={isFetchingIsochrone || !isochroneLonLat}
              onClick={this._createBookmark}
              style='success'
            >
              <Icon type='plus' /> {messages.analysis.createBookmark}
            </Button>
          </div>
        </div>
      </Group>
    )
  }
}
