import {Box, Stack} from '@chakra-ui/core'
import {
  faDatabase,
  faCube,
  faMap,
  faPlus
} from '@fortawesome/free-solid-svg-icons'
import React from 'react'

import message from 'lib/message'

import {ButtonLink} from './buttons'
import Icon from './icon'
import InnerDock from './inner-dock'
import {Group} from './input'
import {ALink} from './link'

export default function SelectProject(p) {
  return (
    <InnerDock className='block'>
      <legend>
        <span>
          <Icon icon={faMap} /> {p.region.name}
        </span>
      </legend>

      <Group>
        {p.bundles.length > 0 ? (
          <ButtonLink
            to='projectCreate'
            regionId={p.region._id}
            block
            style='success'
            title={message('project.createAction')}
          >
            <Icon icon={faPlus} /> {message('project.createAction')}
          </ButtonLink>
        ) : (
          <ButtonLink
            to='bundleCreate'
            regionId={p.region._id}
            block
            style='success'
            title={message('project.uploadBundle')}
          >
            <Icon icon={faDatabase} /> {message('project.uploadBundle')}
          </ButtonLink>
        )}
      </Group>
      {p.projects.length > 0 && (
        <Stack spacing={4}>
          <Box textAlign='center'>{message('project.goToExisting')}</Box>
          <Box className='list-group'>
            {p.projects.map((project) => (
              <ALink
                className='list-group-item'
                key={project._id}
                to='modifications'
                regionId={p.region._id}
                projectId={project._id}
              >
                <span>
                  <Icon icon={faCube} /> {project.name}
                </span>
              </ALink>
            ))}
          </Box>
        </Stack>
      )}
    </InnerDock>
  )
}
