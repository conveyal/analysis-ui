import {Box, Button, Heading, Stack, Flex} from '@chakra-ui/core'
import {
  faChartArea,
  faCog,
  faDatabase,
  faCube,
  faMap,
  faEdit
} from '@fortawesome/free-solid-svg-icons'
import React from 'react'

import useRouteTo from 'lib/hooks/use-route-to'
import message from 'lib/message'

import Icon from './icon'
import IconButton from './icon-button'
import InnerDock from './inner-dock'

export default function SelectProject({bundles, projects, region}) {
  const routeToBundleCreate = useRouteTo('bundleCreate', {regionId: region._id})
  const routeToProjectCreate = useRouteTo('projectCreate', {
    regionId: region._id
  })
  const routeToRegionSettings = useRouteTo('regionSettings', {
    regionId: region._id
  })

  return (
    <InnerDock>
      <Stack py={4} spacing={4} px={2}>
        <Flex align='center' pl={2}>
          <Heading flex='1' size='md'>
            <Icon icon={faMap} /> {region.name}
          </Heading>
          <IconButton
            label='Edit region settings'
            icon={faCog}
            onClick={routeToRegionSettings}
          />
        </Flex>

        <Stack px={2}>
          {bundles.length > 0 && (
            <Button
              isFullWidth
              leftIcon='small-add'
              onClick={routeToProjectCreate}
              variantColor='green'
            >
              {message('project.createAction')}
            </Button>
          )}

          <Button
            isFullWidth
            onClick={routeToBundleCreate}
            variantColor='green'
          >
            <Icon icon={faDatabase} />
            &nbsp;&nbsp;{message('project.uploadBundle')}
          </Button>
        </Stack>

        {projects.length > 0 && (
          <Box textAlign='center'>{message('project.goToExisting')}</Box>
        )}

        {projects.map((project) => (
          <Box px={2} key={project._id}>
            <Project project={project} />
          </Box>
        ))}
      </Stack>
    </InnerDock>
  )
}

function Project({project}) {
  const goToModifications = useRouteTo('modifications', {
    regionId: project.regionId,
    projectId: project._id
  })
  const goToAnalysis = useRouteTo('analysis', {
    regionId: project.regionId,
    projectId: project._id
  })
  return (
    <Stack
      align='center'
      border='1px solid #E2E8F0'
      borderRadius='4px'
      py={2}
      pl={4}
      pr={2}
      isInline
      spacing={3}
    >
      <Box flex='1'>
        <Icon icon={faCube} />
        &nbsp;&nbsp;{project.name}
      </Box>
      <IconButton
        icon={faChartArea}
        label='Analyze project'
        onClick={goToAnalysis}
      />
      <IconButton
        icon={faEdit}
        label='Edit modifications'
        onClick={goToModifications}
      />
    </Stack>
  )
}
