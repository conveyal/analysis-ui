import {Flex, Heading, Stack} from '@chakra-ui/core'
import {useState} from 'react'

import useRouteTo from 'lib/hooks/use-route-to'
import message from 'lib/message'

import ExportProject from './export-project'
import IconButton from './icon-button'

export default function ProjectTitle({project}) {
  const [showExportSelect, setShowExportSelect] = useState(false)
  const goToProjectSettings = useRouteTo('projectSettings', {
    regionId: project.regionId,
    projectId: project._id
  })
  const goToModificationImport = useRouteTo('modificationImport', {
    projectId: project._id,
    regionId: project.regionId
  })
  const name = project ? project.name : 'Loading...'
  return (
    <Flex align='center' borderBottom='1px solid #E2E8F0' pl={4} pr={2} py={2}>
      <Heading flex='1' size='md'>
        {name}
      </Heading>
      {project && (
        <Stack isInline spacing={1}>
          <IconButton
            icon='settings'
            label={message('project.editSettings')}
            onClick={goToProjectSettings}
          />
          <IconButton
            icon='external-link'
            label={message('project.export')}
            onClick={() => setShowExportSelect(true)}
          />
          <IconButton
            icon='download'
            label={message('modification.importFromProject')}
            onClick={goToModificationImport}
          />
          {showExportSelect && (
            <ExportProject
              onHide={() => setShowExportSelect(false)}
              project={project}
            />
          )}
        </Stack>
      )}
    </Flex>
  )
}
