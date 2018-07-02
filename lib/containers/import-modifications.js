// @flow
import {connect} from 'react-redux'

import {copyFromProject} from '../actions/modifications'
import ImportModifications from '../components/import-modifications'
import * as select from '../selectors'
import {push} from 'react-router-redux'

function mapStateToProps (state, props) {
  return {
    candidateProjectOptions: select.candidateProjectOptions(state, props),
    toProjectId: props.params.projectId,
    variants: select.variants(state, props),
    regionId: props.params.regionId
  }
}

const mapDispatchToProps = {copyFromProject, push}

export default connect(mapStateToProps, mapDispatchToProps)(ImportModifications)
