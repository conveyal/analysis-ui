// @flow
import Icon from '@conveyal/woonerf/components/icon'
import React, {Component} from 'react'
import {Link} from 'react-router'

import {Button} from './buttons'
import InnerDock from './inner-dock'
import {Group} from './input'
import messages from '../utils/messages'

type Props = {
  clearCurrentRegion: () => void,
  loadAllRegions: () => void,
  regions: Array<{_id: string, name: string}>,
  push: (string) => void
}

export default class SelectRegion extends Component<void, Props, void> {
  componentDidMount () {
    this.props.clearCurrentRegion()
    this.props.loadAllRegions()
  }

  render () {
    const {regions, push} = this.props
    return (
      <InnerDock>
        <div className='WelcomeTitle'>
          <p style={{textAlign: 'center'}}>
            {messages.region.welcome}
          </p>
          <span className='logo' to='/'>
            conveyal analysis
          </span>
        </div>
        <div className='block'>
          <Group>
            <Button
              block
              onClick={() => push(`/regions/create`)}
              style='success'
            >
              <Icon type='cubes' /> {messages.region.createAction}
            </Button>
          </Group>
          {regions.length > 0 &&
            <div>
              <p style={{textAlign: 'center'}}>
                {messages.region.goToExisting}
              </p>
              <div className='list-group'>
                {regions.map(region => (
                  <Link
                    className='list-group-item'
                    key={region._id}
                    to={`/regions/${region._id}`}
                    title={messages.region.goToRegion}
                  >
                    {region.statusCode === 'DONE'
                      ? <span><Icon type='cubes' /> {region.name}</span>
                      : <div>
                        <p>
                          <Icon type='spinner' className='fa-spin' />
                          {' '}
                          {region.name}
                        </p>
                        <em>
                          {messages.region.statusCode[region.statusCode]}
                        </em>
                      </div>}
                  </Link>
                ))}
              </div>
            </div>}
        </div>
      </InnerDock>
    )
  }
}
