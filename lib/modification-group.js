import React, {PropTypes} from 'react'
import toSentenceCase from 'to-sentence-case'

import DeepEqual from './components/deep-equal'
import Icon from './components/icon'
import ModificationTitle from './modification-title'

const LIMIT = 10

export default class ModificationGroup extends DeepEqual {
  static propTypes = {
    activeModification: PropTypes.object,
    modifications: PropTypes.array.isRequired,
    projectId: PropTypes.string.isRequired,
    replaceModification: PropTypes.func.isRequired,
    scenarioId: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  }

  create = (e) => {
    e.preventDefault()
    const {modifications, create} = this.props
    create()
    if (!this.state.expanded) {
      this.setState({
        ...this.state,
        expanded: true
      })
    }
    if (modifications.length > this.state.limit) {
      this.showMore()
    }
  }

  state = {
    limit: LIMIT,
    skip: 0,
    expanded: true
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
    const {activeModification, modifications, projectId, replaceModification, scenarioId, type} = this.props
    const {expanded} = this.state

    const shownModifications = modifications.slice(this.state.skip, this.state.limit)
    const hasModifications = shownModifications.length !== 0
    const hasMoreModifications = modifications.length > shownModifications.length
    const iconName = expanded
      ? 'chevron-down'
      : 'chevron-right'
    const showOrHide = expanded ? 'Hide' : 'Show'

    return (
      <div className='ModificationGroup'>
        <div
          className='ModificationGroupTitle'
          onClick={this.toggleExpand}
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
            {shownModifications.map((modification) =>
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
        {expanded && hasMoreModifications &&
          <a
            className='ShowMore'
            onClick={this.showMore}
            >Show more...
          </a>}
      </div>
    )
  }
}
