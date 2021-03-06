import EditProject from 'lib/components/edit-project'
import {useProject} from 'lib/hooks/use-model'
import withDataLayout from 'lib/with-data-layout'

export default withDataLayout<{project: CL.Project}>(EditProject, (p) => ({
  project: useProject(p.query.projectId)
}))
