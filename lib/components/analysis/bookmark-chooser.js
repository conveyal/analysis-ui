import isEqual from 'lodash.isequal'
import React, { Component, PropTypes } from 'react'
import Select from 'react-select'

import {Group, Text} from '../input'
import {Button} from '../buttons'
import Icon from '../icon'
import messages from '../../utils/messages'

export default class BookmarkChooser extends Component {
  static propTypes = {
    bookmarks: PropTypes.array.isRequired,
    isochroneLonLat: PropTypes.object.isRequired,
    isFetchingIsochrone: PropTypes.bool.isRequired,
    profileRequest: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    comparisonInProgress: PropTypes.bool.isRequired,
    comparisonScenarioId: PropTypes.string,
    comparisonVariant: PropTypes.number,
    comparisonModifications: PropTypes.array,
    comparisonIsochrone: PropTypes.object,
    comparisonBundleId: PropTypes.string,
    currentIndicator: PropTypes.string,
    isochroneCutoff: PropTypes.number.isRequired,
    modifications: PropTypes.array.isRequired,
    scenarioId: PropTypes.string.isRequired,
    variantIndex: PropTypes.number.isRequired,
    workerVersion: PropTypes.string.isRequired,

    createBookmark: PropTypes.func.isRequired,
    fetchIsochrone: PropTypes.func.isRequired,
    selectBookmark: PropTypes.func.isRequired
  }

  state = {
    bookmarkName: '',
    creatingBookmark: false
  }

  selectBookmark = (e) => {
    const {
      bookmarks,
      comparisonInProgress,
      comparisonScenarioId,
      comparisonVariant,
      comparisonModifications,
      comparisonBundleId,
      bundleId,
      projectId,
      workerVersion,
      modifications,
      scenarioId,
      variantIndex,

      fetchIsochrone,
      selectBookmark
    } = this.props

    // leave comparison params undefined unless we're doing a comparison
    const comparisonParams = comparisonInProgress
      ? {
        comparisonScenarioId: `${comparisonScenarioId}_${comparisonVariant}`,
        comparisonModifications: comparisonModifications,
        comparisonBundleId: comparisonBundleId
      }
      : {}

    const bookmark = bookmarks.find(b => b.id === e.value)

    const origin = {
      lon: bookmark.profileRequest.fromLon,
      lat: bookmark.profileRequest.fromLat
    }

    fetchIsochrone({
      bundleId,
      workerVersion,
      origin,
      modifications,
      projectId,
      scenarioId: `${scenarioId}_${variantIndex}`,
      isochroneCutoff: bookmark.isochroneCutoff,
      indicator: bookmark.destinationGrid,
      profileRequest: bookmark.profileRequest,
      ...comparisonParams
    })

    selectBookmark(bookmark)
  }

  prepareCreateBookmark = (e) => this.setState({ creatingBookmark: true })
  setBookmarkName = (e) => this.setState({ bookmarkName: e.target.value })

  createBookmark = () => {
    const { bookmarkName } = this.state
    const { currentIndicator, isochroneLonLat, isochroneCutoff, profileRequest, createBookmark, projectId } = this.props
    const { lat, lon } = isochroneLonLat

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

    this.setState({ creatingBookmark: false, bookmarkName: '' })
  }

  render () {
    const { creatingBookmark } = this.state
    return creatingBookmark ? this.renderBookmarkCreate() : this.renderBookmarkSelect()
  }

  renderBookmarkSelect () {
    const { bookmarks, profileRequest, isochroneCutoff, isochroneLonLat, isFetchingIsochrone, currentIndicator } = this.props
    const options = bookmarks.map(b => ({
      label: b.name,
      value: b.id
    })).sort((a, b) => {
      if (a.name === b.name) return 0
      else if (a.name == null) return -1
      else if (b.name == null) return 1
      else return a.name.localeCompare(b.name)
    })

    const selectedBookmark = bookmarks.find(b =>
      Math.abs(b.profileRequest.fromLon - isochroneLonLat.lon) < 1e-8 &&
      Math.abs(b.profileRequest.fromLat - isochroneLonLat.lat) < 1e-8 &&
      currentIndicator === b.destinationGrid &&
      isochroneCutoff === b.isochroneCutoff &&
      isEqual(b.profileRequest, profileRequest)
    )

    return <div>
      <Group label={messages.analysis.bookmark}>
        <Select
          options={options}
          disabled={isFetchingIsochrone} // don't allow users to reselect bookmarks while their bookmark is loading
          value={selectedBookmark && selectedBookmark.id}
          onChange={this.selectBookmark}
        />
      </Group>
      <Button onClick={this.prepareCreateBookmark} disabled={isFetchingIsochrone}>
        <Icon type='plus' />&nbsp;
        {messages.analysis.createBookmark}
      </Button>
    </div>
  }

  renderBookmarkCreate () {
    const {isFetchingIsochrone} = this.props
    const {bookmarkName} = this.state
    return <div>
      <Group label={messages.analysis.bookmarkName}>
        <Text
          value={bookmarkName}
          onChange={this.setBookmarkName}
          placeholder={messages.analysis.bookmarkName}
        />
      </Group>

      {/* it would be confusing to allow the user to create a bookmark during isochrone fetch;
        the bookmarked settings might not correspond to the desired ones */}
      <Button onClick={this.createBookmark} disabled={isFetchingIsochrone}>
        <Icon type='check' />&nbsp;
        {messages.analysis.createBookmark}
      </Button>
    </div>
  }
}
