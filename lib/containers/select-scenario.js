import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import SelectScenario from '../components/select-scenario'

function mapStateToProps ({scenario}, {params}) {
  return {
    projectId: params.projectId,
    scenarios: scenario.scenarios
  }
}

export default connect(mapStateToProps, {push})(SelectScenario)
