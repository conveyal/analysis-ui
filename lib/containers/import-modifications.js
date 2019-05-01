import get from 'lodash/get'
import Router from 'next/router'
import {connect} from 'react-redux'

import {copyFromProject} from 'lib/actions/modifications'
import ImportModifications from 'lib/components/import-modifications'
import {RouteTo} from 'lib/constants'

function mapStateToProps(state, props) {
  const toProjectId = props.query.projectId
  return {
    projects: get(state, 'project.projects', []).filter(
      p => p._id !== toProjectId
    )
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  const {regionId, projectId} = ownProps.query
  return {
    copyFromProject: fromProjectId =>
      dispatch(
        copyFromProject({
          fromProjectId,
          regionId,
          toProjectId: projectId
        })
      ),
    goToImportShapeFile: () =>
      Router.push({
        pathname: RouteTo.importShapefile,
        query: {regionId, projectId}
      })
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImportModifications)
