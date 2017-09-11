// @flow
import Icon from '@conveyal/woonerf/components/icon'
import memoize from 'lodash/memoize'
import React, {Component} from 'react'

import {Button} from './buttons'
import {Group, Text} from './input'
import messages from '../utils/messages'

import type {Bundle, Feed} from '../types'

type Props = {
  bundle: Bundle,
  bundleId: string,
  feeds: Feed[],
  name: string,
  projectId: string,

  deleteBundle: () => void,
  fetchFeeds: () => void,
  saveBundle: (Bundle) => void
}

export default class EditBundle extends Component {
  props: Props

  state = {
    feeds: this.props.bundle.feeds,
    name: this.props.name
  }

  componentDidMount () {
    this.props.fetchFeeds()
  }

  _submit = () => {
    const {bundle, saveBundle} = this.props
    const {feeds, name} = this.state
    if (bundle && name) {
      saveBundle({...bundle, feeds, name})
    }
  }

  _deleteBundle = () => window.confirm(messages.bundle.deleteConfirmation) &&
    this.props.deleteBundle()

  _setName = (e: Event & {target: HTMLInputElement}) =>
    this.setState({name: e.target.value})

  _setFeedName = memoize((feedId) => (e: Event & {target: HTMLInputElement}) =>
    this.setState({
      feeds: this.state.feeds.map((feed) => feed.feedId === feedId
        ? {...feed, name: e.target.value}
        : feed
      )
    }))

  render () {
    const {bundle, feeds} = this.props
    const {name} = this.state
    return (
      <div>
        <h5>
          {messages.bundle.edit}
        </h5>
        <Text
          label='Bundle name'
          name='Name'
          onChange={this._setName}
          placeholder='Bundle name'
          value={name}
        />

        {bundle.feeds.map((feed) =>
          <Group label={`Feed #${feed.checksum}`} key={feed.feedId}>
            <Text
              name='Feed'
              placeholder='Feed name'
              value={feed.name}
            />
            <FeedInfo feed={feeds.find((f) => f.id === feed.feedId)} />
          </Group>)}

        <Button
          block
          onClick={this._submit}
          style='success'
          >
          <Icon type='save' /> {messages.bundle.edit}
        </Button>

        <Button block style='danger' onClick={this._deleteBundle}>
          <Icon type='trash' /> {messages.bundle.delete}
        </Button>
      </div>
    )
  }
}

function FeedInfo ({feed}) {
  return feed
    ? <div className='row'>
      <div className='col-xs-6'><strong>Routes:</strong> {feed.routes.length}</div>
      <div className='col-xs-6'><strong>Stops: </strong> {feed.stops.length}</div>
    </div>
    : <span />
}
