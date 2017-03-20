import React, {PropTypes} from 'react'

import messages from '../../utils/messages'
import DeepEqual from '../deep-equal'
import Icon from '../icon'
import ModificationTitle from './title'

export default class ModificationGroup extends DeepEqual {
  static propTypes = {
    activeModification: PropTypes.object,
    create: PropTypes.func.isRequired,
    editModification: PropTypes.func.isRequired,
    modifications: PropTypes.array.isRequired,
    replaceModification: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired
  }

  state = {
    expanded: true
  }

  create = (e) => {
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
    const {activeModification, editModification, modifications, replaceModification, type} = this.props
    const {expanded} = this.state
    const hasModifications = modifications.length !== 0
    const iconName = expanded
      ? 'caret-down'
      : 'caret-right'
    const showOrHide = expanded ? 'Hide' : 'Show'

    return (
      <div className='ModificationGroup'>
        <a
          className='ModificationGroupTitle'
          onClick={this._toggleExpand}
          tabIndex={0}
          title={`${showOrHide} modification group`}
          >
          <Icon type={iconName} />
          <span> {messages.modificationType[type]}</span>
          <a
            className='pull-right'
            onClick={this.create}
            tabIndex={0}
            title={`Create ${type}`}
            ><Icon type='plus' /> Create
          </a>
        </a>
        {expanded &&
          <div className='ModificationTitles'>
            {modifications.map((modification) =>
              <ModificationTitle
                active={!!activeModification && modification.id === activeModification.id}
                editModification={editModification}
                key={`modification-${modification.id}`}
                modification={modification}
                name={modification.name}
                replaceModification={replaceModification}
                showOnMap={modification.showOnMap}
                />
            )}
            {!hasModifications &&
              <div className='ModificationTitlePlaceholder'>No modifications of this type exist!</div>
            }
          </div>
        }
      </div>
    )
  }
}
