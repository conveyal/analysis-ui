import {Box, Flex, Heading, IconButton, Stack, Tooltip} from '@chakra-ui/core'
import {useState} from 'react'

import useRouteTo from 'lib/hooks/use-route-to'
import message from 'lib/message'

import ExportProject from './export-project'

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
    <Flex align='center' borderBottom='1px solid #E2E8F0' px={4} py={2}>
      <Heading flex='1' size='md'>
        {name}
      </Heading>
      {project && (
        <Stack isInline spacing={1}>
          <Box>
            <Tooltip
              aria-label={message('project.editSettings')}
              hasArrow
              label={message('project.editSettings')}
              placement='left'
            >
              <IconButton
                aria-label={message('project.editSettings')}
                onClick={goToProjectSettings}
                icon='settings'
                size='sm'
                variant='ghost'
                variantColor='blue'
              />
            </Tooltip>
          </Box>
          <Box>
            <Tooltip
              aria-label={message('project.export')}
              hasArrow
              label={message('project.export')}
              placement='left'
            >
              <IconButton
                aria-label={message('project.export')}
                icon='external-link'
                onClick={() => setShowExportSelect(true)}
                size='sm'
                variant='ghost'
                variantColor='blue'
              />
            </Tooltip>
          </Box>
          <Box>
            <Tooltip
              aria-label={message('modification.importFromProject')}
              hasArrow
              label={message('modification.importFromProject')}
              placement='left'
            >
              <IconButton
                aria-label={message('modification.importFromProject')}
                onClick={goToModificationImport}
                icon='download'
                size='sm'
                transform='rotate(180deg)'
                variant='ghost'
                variantColor='blue'
              />
            </Tooltip>
          </Box>
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
