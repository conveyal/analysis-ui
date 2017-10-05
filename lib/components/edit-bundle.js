// @flow
import Icon from '@conveyal/woonerf/components/icon'
import memoize from 'lodash/memoize'
import React, {Component} from 'react'

import {Button} from './buttons'
import {Text} from './input'
import messages from '../utils/messages'

import type {Bundle} from '../types'

type Props = {
  bundle: Bundle,
  bundleId: string,

  deleteBundle: () => void,
  saveBundle: (bundle: Bundle) => void
}

export default class EditBundle extends Component {
  props: Props
  state: {
    bundle: Bundle
  }

  state = {
    bundle: this.props.bundle
  }

  componentWillReceiveProps (nextProps: Props) {
    if (nextProps.bundleId !== this.props.bundleId) {
      this.setState({
        bundle: nextProps.bundle
      })
    }
  }

  _submit = () => {
    this.props.saveBundle(this.state.bundle)
  }

  _deleteBundle = () =>
    window.confirm(messages.bundle.deleteConfirmation) &&
    this.props.deleteBundle()

  _setName = (e: Event & {target: HTMLInputElement}) => {
    if (e.target.value && e.target.value.length > 0) {
      this.setState({
        bundle: {
          ...this.state.bundle,
          name: `${e.target.value}`
        }
      })
    }
  }

  _setFeedName = memoize(feedId => (e: Event & {target: HTMLInputElement}) => {
    const {bundle} = this.state
    if (e.target.value && e.target.value.length > 0) {
      this.setState({
        bundle: {
          ...bundle,
          feeds: bundle.feeds.map((f) => {
            if (f.feedId === feedId) {
              return {
                ...f,
                name: e.target.value
              }
            }
            return f
          })
        }
      })
    }
  })

  render () {
    const {bundle} = this.props
    return (
      <div>
        <h5>Edit Bundle</h5>
        <Text
          label='Bundle name'
          name='Name'
          onChange={this._setName}
          placeholder='Bundle name'
          value={bundle.name}
        />

        {bundle.feeds.map(feed => (
          <Text
            disabled
            title='Editing temporarily disabled'
            key={feed.feedId}
            label={`Feed #${feed.checksum}`}
            name='Feed'
            onChange={this._setFeedName(feed.feedId)}
            placeholder='Feed name'
            value={feed.name}
          />
        ))}

        <Button block onClick={this._submit} style='success'>
          <Icon type='save' /> {messages.bundle.edit}
        </Button>

        <Button block style='danger' onClick={this._deleteBundle}>
          <Icon type='trash' /> {messages.bundle.delete}
        </Button>
      </div>
    )
  }
}
