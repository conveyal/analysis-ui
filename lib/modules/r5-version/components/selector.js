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
  selectCurrentR5Version,
  selectReleaseVersions
} from '../selectors'

import type {ReactSelectResult} from '../../../types'

type Props = {
  allVersions: string[],
  currentVersion: string,
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
    const {releaseVersions, allVersions, currentVersion, ...rest} = this.props

    const versions = showAllVersions ? allVersions : releaseVersions
    const options = versions.map(v => {
      return {
        value: v,
        label: v
      }
    })

    // if this project has an older version that is no longer supported, show it
    // but strike it through
    if (!versions.includes(currentVersion)) {
      options.push({
        value: currentVersion,
        label: (
          <span style={{textDecoration: 'line-through'}}>
            {currentVersion}
          </span>
        )
      })
    }

    // versions are in reverse-chronological order
    // NB if a non-release version is selected, this will show the message if
    // there is a more recent release version available
    const latestReleaseVersionSelected =
      currentVersion && currentVersion.startsWith(releaseVersions[0])

    return (
      <div>
        <Group {...this.props}>
          <Icon
            type='flask'
            style={{
              color: showAllVersions ? '#000' : '#aaa',
              cursor: 'pointer'
            }}
            title={
              showAllVersions
                ? messages.region.showReleaseVersions
                : messages.region.showAllVersions
            }
            onClick={this._toggleAllVersions}
          />

          <Select
            clearable={false}
            onChange={this._selectVersion}
            options={options}
            value={currentVersion}
            {...rest}
            />
        </Group>

        {!latestReleaseVersionSelected &&
          <div className='alert alert-warning'>
            {messages.region.latestReleaseVersionNotSelected}
          </div>}
      </div>
    )
  }
}

export default connect(createStructuredSelector({
  allVersions: selectAllValidVersions,
  currentVersion: selectCurrentR5Version,
  releaseVersions: selectReleaseVersions
}), {
  loadR5Versions,
  setCurrentR5Version
})(SelectR5Version)
