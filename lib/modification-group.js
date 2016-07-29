import React, {PropTypes} from 'react'
import toSentenceCase from 'to-sentence-case'

import {Button} from './components/buttons'
import DeepEqual from './components/deep-equal'
import Icon from './components/icon'
import Title from './components/dock-content-title'
import Modification from './modification'

const LIMIT = 10

export default class ModificationGroup extends DeepEqual {
  static propTypes = {
    modifications: PropTypes.array.isRequired,
    type: PropTypes.string.isRequired
  }

  create = () => {
    this.props.create()
  }

  state = {
    limit: 10,
    skip: 0
  }

  showMore = () => {
    this.setState({
      ...this.state,
      limit: this.state.limit + LIMIT
    })
  }

  render () {
    const {modifications, type} = this.props
    const shownModifications = modifications.slice(this.state.skip, this.state.limit)
    const hasMoreModifications = modifications.length > shownModifications.length
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
          {shownModifications.map((modification) =>
            <Modification
              key={`modification-${modification.id}`}
              modification={modification}
              />
          )}
          {hasMoreModifications &&
            <Button
              block
              onClick={this.showMore}
              >Show more
            </Button>}
        </div>
      </div>
    )
  }
}
