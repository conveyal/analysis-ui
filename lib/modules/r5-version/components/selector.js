// @flow
import Icon from '@conveyal/woonerf/components/icon'
import React, {Component} from 'react'
import {connect} from 'react-redux'
import Select from 'react-select'
import {createStructuredSelector} from 'reselect'

import messages from '../../../utils/messages'
import {Group} from '../../../components/input'

import {
  loadR5Versions,
  setCurrentR5Version
} from '../actions'
import {RELEASE_VERSION_REGEX} from '../constants'
import {
  selectAllValidVersions,
  selectAnalysisVersion,
  selectCurrentR5Version,
  selectNewerVersionIsAvailable,
  selectReleaseVersions
} from '../selectors'

import type {ReactSelectResult} from '../../../types'

type Props = {
  allVersions: string[],
  analysisVersion?: string,
  currentVersion: string,
  newerVersionIsAvailable: boolean,
  releaseVersions: string[],

  loadR5Versions: () => void,
  setCurrentR5Version: (version: string) => void
}

type State = {
  showAllVersions: boolean
}

/**
 * Select an R5 version, based on what is available in S3
 */
export class SelectR5Version extends Component<void, Props, State> {
  state = {
    showAllVersions: !RELEASE_VERSION_REGEX.test(this.props.currentVersion)
  }

  componentDidMount () {
    this.props.loadR5Versions()
  }

  _selectVersion = (result: ReactSelectResult) => {
    this.props.setCurrentR5Version(result.value)
  }

  _toggleAllVersions = () => {
    const {currentVersion} = this.props
    const {showAllVersions} = this.state

    // don't allow turning off the flask when a non-release version is selected
    if (RELEASE_VERSION_REGEX.test(currentVersion) || !showAllVersions) {
      this.setState({showAllVersions: !this.state.showAllVersions})
    }
  }

  render () {
    const {showAllVersions} = this.state
    const {
      allVersions,
      analysisVersion,
      currentVersion,
      newerVersionIsAvailable,
      releaseVersions
    } = this.props

    const versions = showAllVersions ? allVersions : releaseVersions
    const options = versions.map(v => {
      return {
        value: v,
        label: v
      }
    })

    // if this region has an older version that is no longer supported, show it
    // but strike it through
    if (!allVersions.includes(currentVersion)) {
      options.push({
        value: currentVersion,
        label: (
          <span style={{textDecoration: 'line-through'}}>
            {currentVersion}
          </span>
        )
      })
    }

    return (
      <div>
        <Group label={messages.r5Version.title}>
          <Icon
            type='flask'
            style={{
              color: showAllVersions ? '#000' : '#aaa',
              cursor: 'pointer'
            }}
            title={
              showAllVersions
                ? messages.r5Version.showRelease
                : messages.r5Version.showAll
            }
            onClick={this._toggleAllVersions}
          />

          <Select
            clearable={false}
            onChange={this._selectVersion}
            options={options}
            value={currentVersion}
            />
        </Group>

        {newerVersionIsAvailable &&
          <div className='alert alert-warning'>
            {messages.r5Version.latestReleaseVersionNotSelected}
          </div>}

        {analysisVersion && analysisVersion !== currentVersion &&
          <div className='alert alert-warning'>
            {messages.r5Version.analysisVersionDifferent}
          </div>}
      </div>
    )
  }
}

export default connect(createStructuredSelector({
  allVersions: selectAllValidVersions,
  analysisVersion: selectAnalysisVersion,
  currentVersion: selectCurrentR5Version,
  newerVersionIsAvailable: selectNewerVersionIsAvailable,
  releaseVersions: selectReleaseVersions
}), {
  loadR5Versions,
  setCurrentR5Version
})(SelectR5Version)
