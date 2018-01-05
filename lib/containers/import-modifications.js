// @flow
import {connect} from 'react-redux'

import {copyFromProject} from '../actions/modifications'
import ImportModifications from '../components/import-modifications'
import * as select from '../selectors'

function mapStateToProps (state, props) {
  return {
    candidateProjectOptions: select.candidateProjectOptions(state, props),
    toProjectId: props.params.projectId,
    variants: select.variants(state, props)
  }
}

const mapDispatchToProps = {copyFromProject}

export default connect(mapStateToProps, mapDispatchToProps)(ImportModifications)
