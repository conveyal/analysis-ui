// @flow
import {
  faDatabase,
  faCube,
  faMap,
  faPlus
} from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import React from 'react'

import message from '../message'
import type {Bundle, Project, Region} from '../types'

import {Application, Dock, Title} from './base'
import {Button} from './buttons'
import {PATHS} from '../constants'
import Icon from './icon'
import {Group} from './input'

type Props = {
  bundles: Bundle[],
  projects: Project[],
  region: Region
}

function Status({code}: {code: string}) {
  switch (code) {
    case 'DONE':
      return <span />
    case 'ERROR':
      return (
        <div className='alert alert-danger'>
          {message('region.statusCode.ERROR')}
        </div>
      )
    default:
      return (
        <div className='alert alert-info'>
          <Icon type='spinner' className='fa-spin' />{' '}
          {message(`region.statusCode.${code}`)}
        </div>
      )
  }
}

export default function SelectProject(p: Props) {
  return (
    <Application {...p}>
      <Title>
        <Icon icon={faMap} fixedWidth /> {p.region.name}
      </Title>
      <Dock>
        {p.region.statusCode && <Status code={p.region.statusCode} />}

        <Group>
          {p.bundles.length > 0 ? (
            <Link
              href={{
                pathname: PATHS.projectCreate,
                query: {regionId: p.region._id}
              }}
            >
              <Button
                block
                style='success'
                title={message('project.createAction')}
              >
                <Icon icon={faPlus} fixedWidth />{' '}
                {message('project.createAction')}
              </Button>
            </Link>
          ) : (
            <Link
              href={{
                pathname: PATHS.bundleCreate,
                query: {regionId: p.region._id}
              }}
            >
              <Button
                block
                style='success'
                title={message('project.uploadBundle')}
              >
                <Icon icon={faDatabase} fixedWidth />{' '}
                {message('project.uploadBundle')}
              </Button>
            </Link>
          )}
        </Group>
        {p.projects.length > 0 && (
          <>
            <p className='center'>{message('project.goToExisting')}</p>
            <div className='list-group'>
              {p.projects.map(project => (
                <Link
                  key={project._id}
                  href={{
                    pathname: PATHS.modifications,
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
      </Dock>
    </Application>
  )
}
