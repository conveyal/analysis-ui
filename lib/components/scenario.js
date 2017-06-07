// @flow
import Icon from '@conveyal/woonerf/components/icon'
import React, {Component} from 'react'
import {Link} from 'react-router'

import {Body as PanelBody} from './panel'

type Props = {
  addComponentToMap(): void,
  bundle?: {
    id: string
  },
  children: any,
  id: string,
  load(string): void,
  loadBundle(string): void,
  loadModifications: ({bundleId: string, scenarioId: string}) => void,
  modifications?: any[],
  scenario?: {
    bundleId: string,
    id: string,
    name: string,
    projectId: string
  }
}

export default class Scenario extends Component<void, Props, void> {
  componentDidMount () {
    const {bundle, id, load, loadBundle, loadModifications, modifications, scenario} = this.props

    if (!scenario) {
      load(id)
    } else if (!bundle) {
      loadBundle(scenario.bundleId)
    } else if (!modifications) {
      loadModifications({bundleId: bundle.id, scenarioId: scenario.id})
    }
  }

  componentWillReceiveProps (newProps: Props) {
    const {load, loadBundle, loadModifications} = this.props
    if (this.props.id !== newProps.id) {
      load(newProps.id)
    } else if (newProps.scenario && (!newProps.bundle || newProps.bundle.id !== newProps.scenario.bundleId)) {
      loadBundle(newProps.scenario.bundleId)
    } else if (newProps.scenario && newProps.bundle && !newProps.modifications) {
      loadModifications({bundleId: newProps.bundle.id, scenarioId: newProps.id})
    }
  }

  _dropSinglePointPin = (e: Event) => {
    e.preventDefault()
    this.props.addComponentToMap()
  }

  render () {
    const {bundle, children, id, modifications, scenario} = this.props
    return scenario
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
        {bundle && modifications
          ? <div className='ScenarioContent'>{children}</div>
          : <PanelBody>Loading GTFS bundle & modifications...</PanelBody>}
      </div>
      : <PanelBody>Loading scenario...</PanelBody>
  }
}
