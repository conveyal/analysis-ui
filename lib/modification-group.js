import React from 'react'
import toSentenceCase from 'to-sentence-case'

import {Button} from './components/buttons'
import DeepEqual from './components/deep-equal'
import Icon from './components/icon'
import Title from './components/dock-content-title'
import Modification from './modification'

export default class ModificationGroup extends DeepEqual {
  create = () => {
    this.props.create()
  }

  render () {
    const {modifications, type} = this.props
    return (
      <div className='ModificationGroup'>
        <Title>{toSentenceCase(type)}
          <Button
            className='pull-right'
            onClick={this.create}
            style='success'
            ><Icon type='plus' /> Create
          </Button>
        </Title>
        <div>
          {modifications && modifications.map((modification) =>
            <Modification
              key={`modification-${modification.id}`}
              modification={modification}
              />
          )}
        </div>
      </div>
    )
  }
}
