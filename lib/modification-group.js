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
    const {modifications, create} = this.props
    create()
    if (!this.state.expanded) {
      this.setState({expanded: true})
    }
    if (modifications.length > this.state.limit) {
      this.showMore()
    }
  }

  state = {
    limit: 10,
    skip: 0,
    expanded: false
  }

  showMore = () => {
    this.setState({
      ...this.state,
      limit: this.state.limit + LIMIT
    })
  }
  toggleExpand = () => {
    this.setState({expanded: !this.state.expanded})
  }

  render () {
    const {modifications, type} = this.props
    const shownModifications = modifications.slice(this.state.skip, this.state.limit)
    const hasMoreModifications = modifications.length > shownModifications.length
    const expanded = this.state.expanded && shownModifications.length !== 0
    const iconName = expanded ? 'chevron-up' : 'chevron-down'
    const showOrHide = expanded ? 'Hide' : 'Show'

    return (
      <div className='ModificationGroup'>
        <Title>{toSentenceCase(type)}
          <Button
            className='pull-left'
            onClick={this.toggleExpand}
            size='sm'
            title={`${showOrHide} modification group`}
            disabled={!modifications.length ? 'disabled' : ''}
            ><Icon type={iconName} />
          </Button>
          <Button
            className='pull-right'
            onClick={this.create}
            style='success'
            ><Icon type='plus' /> Create
          </Button>
          {expanded && hasMoreModifications &&
            <Button
              className='pull-right'
              onClick={this.showMore}
              >Show more
            </Button>}
        </Title>
        <div>
          {expanded && shownModifications.map((modification) =>
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
