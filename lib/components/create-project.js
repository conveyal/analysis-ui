import {
  faCheck,
  faExclamationCircle,
  faPlus
} from '@fortawesome/free-solid-svg-icons'
import React from 'react'

import message from '../message'

import {Application, Title, Dock} from './base'
import {Button} from './buttons'
import Icon from './icon'
import {Group as FormGroup, Text} from './input'
import Select from './select'

export default function CreateProject(p) {
  const [bundleId, setBundleId] = React.useState(null)
  const [name, setName] = React.useState('')

  const readyToCreate =
    name && name.length > 0 && bundleId && bundleId.length > 0

  function create() {
    p.create({bundleId, name})
  }

  return (
    <Application>
      <Title>{message('project.createAction')}</Title>
      <Dock>
        <Text
          label={message('project.name')}
          name={message('common.name')}
          onChange={e => setName(e.target.value)}
          value={name}
        />
        {p.bundles.length > 0 ? (
          <FormGroup id='select-bundle' label={message('project.bundle')}>
            <Select
              clearable={false}
              id='select-bundle'
              options={p.bundles.map(bundle => ({
                value: bundle._id,
                label: bundle.name
              }))}
              onChange={option => setBundleId(option.value)}
              placeholder={message('project.selectBundle')}
              value={bundleId}
            />
          </FormGroup>
        ) : (
          <FormGroup>
            <p>{message('project.noBundles')}</p>
            <Button block onClick={p.goToCreateBundle} style='success'>
              <Icon icon={faPlus} fixedWidth /> {message('bundle.create')}
            </Button>
          </FormGroup>
        )}
        {!readyToCreate && (
          <p className='alert alert-danger'>
            <Icon icon={faExclamationCircle} fixedWidth />{' '}
            {message('project.createActionTooltip')}
          </p>
        )}
        <Button
          block
          disabled={!readyToCreate}
          onClick={create}
          style='success'
        >
          <Icon icon={faCheck} fixedWidth /> {message('common.create')}
        </Button>
      </Dock>
    </Application>
  )
}
