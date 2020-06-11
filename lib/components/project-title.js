import {Box, Flex, Heading, Stack} from '@chakra-ui/core'
import {
  faCog,
  faCube,
  faShareAltSquare
} from '@fortawesome/free-solid-svg-icons'
import React from 'react'

import message from 'lib/message'

import ExportProject from './export-project'
import Icon from './icon'
import Link from './link'
import Tip from './tip'

export default function ProjectTitle(p) {
  const [showExportSelect, setShowExportSelect] = React.useState(false)
  const name = p.project ? p.project.name : 'Loading...'
  return (
    <Flex borderBottom='1px solid #E2E8F0' p={4} justify='space-between'>
      <Heading size='md'>
        <Icon icon={faCube} /> {name}
      </Heading>
      {p.project && (
        <Stack fontSize='14px' isInline>
          <Box>
            <Tip tip={message('project.editSettings')}>
              <Link
                to='projectSettings'
                regionId={p.project.regionId}
                projectId={p.project._id}
              >
                <a>
                  <Icon icon={faCog} />
                </a>
              </Link>
            </Tip>
          </Box>
          <Box>
            <Tip tip={message('project.export')}>
              <a
                onClick={() => setShowExportSelect(true)}
                name={message('project.export')}
              >
                <Icon icon={faShareAltSquare} />
              </a>
            </Tip>
          </Box>
          {showExportSelect && (
            <ExportProject
              onHide={() => setShowExportSelect(false)}
              project={p.project}
            />
          )}
        </Stack>
      )}
    </Flex>
  )
}
