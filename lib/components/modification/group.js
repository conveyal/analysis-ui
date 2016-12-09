import React, {PropTypes} from 'react'
import toSentenceCase from 'to-sentence-case'

import DeepEqual from '../deep-equal'
import Icon from '../icon'
import ModificationTitle from './title'

export default class ModificationGroup extends DeepEqual {
  static propTypes = {
    activeModification: PropTypes.object,
    create: PropTypes.func.isRequired,
    modifications: PropTypes.array.isRequired,
    projectId: PropTypes.string.isRequired,
    replaceModification: PropTypes.func.isRequired,
    scenarioId: PropTypes.string.isRequired,
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
    const {activeModification, modifications, projectId, replaceModification, scenarioId, type} = this.props
    const {expanded} = this.state
    const hasModifications = modifications.length !== 0
    const iconName = expanded
      ? 'chevron-down'
      : 'chevron-right'
    const showOrHide = expanded ? 'Hide' : 'Show'

    return (
      <div className='ModificationGroup'>
        <div
          className='ModificationGroupTitle'
          onClick={this._toggleExpand}
          title={`${showOrHide} modification group`}
          >
          <Icon type={iconName} />
          <span> {toSentenceCase(type)}</span>
          <a
            className='pull-right'
            onClick={this.create}
            title={`Create ${type}`}
            ><Icon type='plus' /> Create
          </a>
        </div>
        {expanded &&
          <div className='ModificationTitles'>
            {modifications.map((modification) =>
              <ModificationTitle
                active={!!activeModification && modification.id === activeModification.id}
                key={`modification-${modification.id}`}
                modification={modification}
                name={modification.name}
                projectId={projectId}
                replaceModification={replaceModification}
                scenarioId={scenarioId}
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
