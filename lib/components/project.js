import React, {PropTypes} from 'react'
import {Link} from 'react-router'

import DeepEqualComponent from './deep-equal'
import Icon from './icon'

export default class Project extends DeepEqualComponent {
  static propTypes = {
    children: PropTypes.any,
    description: PropTypes.string,
    id: PropTypes.string.isRequired,
    isLoaded: PropTypes.bool.isRequired,
    load: PropTypes.func.isRequired,
    name: PropTypes.string
  }

  componentWillMount () {
    const {id, load} = this.props
    load(id)
  }

  componentWillReceiveProps (newProps) {
    const {id, load} = this.props
    const isNewProjectId = id !== newProps.id
    if (isNewProjectId) load()
  }

  render () {
    const {children, id, isLoaded, name} = this.props
    return (
      <div>
        <div
          className='DockTitle'
          ><Icon type='globe' />
          <Link
            to={`/projects/${id}`}
            ><span> {name}</span>
          </Link>
          <Link
            className='pull-right'
            to={`/projects/${id}/edit`}
            ><Icon type='pencil' />
          </Link>
        </div>
        {isLoaded && children}
      </div>
    )
  }
}
