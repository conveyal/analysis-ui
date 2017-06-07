// @flow
import Icon from '@conveyal/woonerf/components/icon'
import React, {Component} from 'react'
import {Link} from 'react-router'

import {Body as PanelBody} from './panel'

type Props = {
  addComponentToMap(): void,
  bundleIsLoaded: boolean,
  children: any,
  id: string,
  isLoaded: boolean,
  load(string): void,
  loadBundle(string): void,
  scenario: {
    name: string,
    bundle: string
  }
}

export default class Scenario extends Component<void, Props, void> {
  componentDidMount () {
    const {load, id} = this.props
    load(id)
  }

  componentWillReceiveProps (newProps: Props) {
    const {load, loadBundle} = this.props
    const isNewScenarioId = this.props.id !== newProps.id
    if (isNewScenarioId) {
      load(newProps.id)
    }

    if (!isNewScenarioId && newProps.isLoaded && !newProps.bundleIsLoaded) {
      loadBundle(newProps.scenario.bundle)
    }
  }

  _dropSinglePointPin = (e: Event) => {
    e.preventDefault()
    this.props.addComponentToMap()
  }

  render () {
    const {bundleIsLoaded, children, id, isLoaded, scenario} = this.props
    return isLoaded
      ? <div className='Scenario'>
        <div
          className='DockTitle'
          ><Icon type='cube' /> {scenario.name}
          <Link
            className='pull-right'
            title='Edit scenario'
            to={`/scenarios/${id}/edit`}
            ><Icon type='pencil' />
          </Link>
          <Link
            className='pull-right'
            to={`/scenarios/${id}/import-shapefile`}
            title='Import shapefile'
            ><Icon type='globe' />
          </Link>
          <Link
            className='pull-right'
            to={`/scenarios/${id}/import-modifications`}
            title='Import modifications from another scenario'
            ><Icon type='upload' />
          </Link>
        </div>
        {bundleIsLoaded
          ? <div className='ScenarioContent'>{children}</div>
          : <PanelBody>Loading GTFS bundle...</PanelBody>}
      </div>
      : <PanelBody>Loading scenario...</PanelBody>
  }
}
