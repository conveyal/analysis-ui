// @flow
import {connect} from 'react-redux'

import {copyFromProject} from '../actions/modifications'
import ImportModifications from '../components/import-modifications'
import candidateProjectOptionsSelector
  from '../selectors/candidate-project-options'
import selectVariants from '../selectors/variants'

function mapStateToProps (state, props) {
  return {
    candidateProjectOptions: candidateProjectOptionsSelector(state, props),
    toProjectId: props.params.projectId,
    variants: selectVariants(state, props)
  }
}

const mapDispatchToProps = {copyFromProject}

export default connect(mapStateToProps, mapDispatchToProps)(ImportModifications)
