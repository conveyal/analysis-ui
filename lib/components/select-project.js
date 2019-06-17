import {
  faDatabase,
  faCube,
  faMap,
  faPlus,
  faSpinner
} from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import React from 'react'

import message from 'lib/message'

import {ButtonLink} from './buttons'
import {RouteTo} from '../constants'
import Icon from './icon'
import InnerDock from './inner-dock'
import {Group} from './input'

function Status({code}) {
  switch (code) {
    case 'DONE':
      return null
    case 'ERROR':
      return (
        <div className='alert alert-danger'>
          {message('region.statusCode.ERROR')}
        </div>
      )
    default:
      return (
        <div className='alert alert-info'>
          <Icon icon={faSpinner} spin /> {message(`region.statusCode.${code}`)}
        </div>
      )
  }
}

export default function SelectProject(p) {
  return (
    <InnerDock className='block'>
      <legend>
        <Icon icon={faMap} /> {p.region.name}
      </legend>
      {p.region.statusCode && <Status code={p.region.statusCode} />}

      <Group>
        {p.bundles.length > 0 ? (
          <ButtonLink
            block
            href={{
              pathname: RouteTo.projectCreate,
              query: {regionId: p.region._id}
            }}
            style='success'
            title={message('project.createAction')}
          >
            <Icon icon={faPlus} /> {message('project.createAction')}
          </ButtonLink>
        ) : (
          <ButtonLink
            block
            href={{
              pathname: RouteTo.bundleCreate,
              query: {regionId: p.region._id}
            }}
            style='success'
            title={message('project.uploadBundle')}
          >
            <Icon icon={faDatabase} /> {message('project.uploadBundle')}
          </ButtonLink>
        )}
      </Group>
      {p.projects.length > 0 && (
        <>
          <p className='text-center'>{message('project.goToExisting')}</p>
          <div className='list-group'>
            {p.projects.map(project => (
              <Link
                key={project._id}
                href={{
                  pathname: RouteTo.modifications,
                  query: {
                    regionId: p.region._id,
                    projectId: project._id
                  }
                }}
              >
                <a
                  className='list-group-item'
                  title={message('project.goToProject')}
                >
                  <Icon icon={faCube} /> {project.name}
                </a>
              </Link>
            ))}
          </div>
        </>
      )}
    </InnerDock>
  )
}
