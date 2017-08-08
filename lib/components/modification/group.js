import React, {PropTypes} from 'react'

import messages from '../../utils/messages'
import DeepEqual from '../deep-equal'
import Icon from '../icon'
import ModificationTitle from './title'

export default class ModificationGroup extends DeepEqual {
  static propTypes = {
    activeModification: PropTypes.object,
    modifications: PropTypes.array.isRequired,
    type: PropTypes.string.isRequired,

    create: PropTypes.func.isRequired,
    editModification: PropTypes.func.isRequired,
    updateModification: PropTypes.func.isRequired
  }

  state = {
    expanded: true
  }

  create = e => {
    e.preventDefault()
    e.stopPropagation()
    const {create} = this.props
    create()
    if (!this.state.expanded) {
      this.setState({
        expanded: true
      })
    }
  }

  _toggleExpand = () => {
    this.setState({expanded: !this.state.expanded})
  }

  render () {
    const {
      activeModification,
      editModification,
      modifications,
      type,
      updateModification
    } = this.props
    const {expanded} = this.state
    const hasModifications = modifications.length !== 0
    const iconName = expanded ? 'caret-down' : 'caret-right'
    const showOrHide = expanded ? 'Hide' : 'Show'

    return (
      <div className='ModificationGroup'>
        <div className='ModificationGroupTitle'>
          <a
            onClick={this._toggleExpand}
            tabIndex={0}
            title={`${showOrHide} modification group`}
          >
            <Icon type={iconName} /> {messages.modificationType[type]}
          </a>
          <a
            className='pull-right'
            onClick={this.create}
            tabIndex={0}
            title={`Create ${type}`}
          >
            <Icon type='plus' /> Create
          </a>
        </div>
        {expanded &&
          <div className='ModificationTitles'>
            {modifications.map(modification =>
              <ModificationTitle
                active={
                  !!activeModification &&
                  modification.id === activeModification.id
                }
                editModification={editModification}
                key={`modification-${modification.id}`}
                modification={modification}
                name={modification.name}
                showOnMap={modification.showOnMap}
                updateModification={updateModification}
              />
            )}
            {!hasModifications &&
              <div className='ModificationTitlePlaceholder'>
                No modifications of this type exist!
              </div>}
          </div>}
      </div>
    )
  }
}
