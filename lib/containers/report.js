/** Container for a report on a scenario */

import React from 'react'
import {connect} from 'react-redux'
import Report from '../report/index'
import Modal from 'react-modal'

function mapStateToProps (state, props) {
  let { project, scenario } = state
  return {
    modifications: scenario.modifications,
    project: project.projectsById[props.projectId],
    feedsById: scenario.feedsById
  }
}

const mapDispatchToProps = {}

const ModalReport = (props) => <Modal isOpen><Report {...props} /></Modal>

export default connect(mapStateToProps, mapDispatchToProps)(ModalReport)
