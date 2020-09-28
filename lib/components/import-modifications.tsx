import {Box, Button, Heading, Stack} from '@chakra-ui/core'
import {faUpload} from '@fortawesome/free-solid-svg-icons'
import fpGet from 'lodash/fp/get'
import {useState} from 'react'
import {useDispatch} from 'react-redux'

import {copyFromProject} from 'lib/actions/modifications'
import useRouteTo from 'lib/hooks/use-route-to'
import message from 'lib/message'

import ButtonLink from './button-link'
import Icon from './icon'
import Select from './select'

const getName = fpGet('name')
const getId = fpGet('_id')

export default function ImportModifications({projects, projectId, regionId}) {
  const dispatch = useDispatch<any>()
  const [importProjectId, setImportProjectId] = useState()
  const routeToModifications = useRouteTo('modifications', {
    projectId,
    regionId
  })

  /**
   * Create modifications by copying from the selected project and then redirect
   * to the project's modification list page.
   */
  function _copyFromProject() {
    dispatch(
      copyFromProject({
        fromProjectId: importProjectId,
        toProjectId: projectId
      })
    ).then(() => routeToModifications())
  }

  return (
    <Stack p={4} spacing={4}>
      <Heading size='md'>{message('modification.importFromShapefile')}</Heading>
      <ButtonLink
        to='importShapefile'
        query={{
          projectId,
          regionId
        }}
        variantColor='green'
      >
        <Icon icon={faUpload} /> Import from Shapefile
      </ButtonLink>
      <Heading size='md'>{message('modification.importFromProject')}</Heading>
      <Box>{message('modification.importFromProjectInfo')}</Box>
      <Box>
        <Select
          getOptionLabel={getName}
          getOptionValue={getId}
          onChange={(p) => setImportProjectId(getId(p))}
          options={projects}
          placeholder={message('project.select')}
          value={projects.find((p) => p._id === importProjectId)}
        />
      </Box>
      <Button
        isDisabled={!importProjectId}
        leftIcon='copy'
        onClick={_copyFromProject}
        variantColor='green'
      >
        Import from existing project
      </Button>
    </Stack>
  )
}
