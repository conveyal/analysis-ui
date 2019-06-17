import {
  faCheck,
  faExclamationCircle,
  faPlus
} from '@fortawesome/free-solid-svg-icons'
import {useRouter} from 'next/router'
import React from 'react'
import {useDispatch} from 'react-redux'

import {create} from 'lib/actions/project'
import {RouteTo} from 'lib/constants'
import message from 'lib/message'

import {Button, ButtonLink} from './buttons'
import Icon from './icon'
import InnerDock from './inner-dock'
import {Group as FormGroup, Text} from './input'
import Select from './select'

export function CreateProject(p) {
  const [bundleId, setBundleId] = React.useState(null)
  const [creating, setCreating] = React.useState(false)
  const [name, setName] = React.useState('')
  const {dispatch, router} = p
  const {regionId} = router.query

  const readyToCreate =
    name && name.length > 0 && bundleId && bundleId.length > 0

  function _create() {
    setCreating(true)
    dispatch(
      create({bundleId, name, regionId}).then(project => {
        router.push({
          pathname: RouteTo.modifications,
          query: {regionId: project.regionId, projectId: project._id}
        })
      })
    )
  }

  return (
    <InnerDock className='block'>
      <legend>{message('project.createAction')}</legend>
      <Text
        label={message('project.name')}
        name={message('common.name')}
        onChange={e => setName(e.target.value)}
        value={name}
      />
      {p.bundles.length > 0 ? (
        <FormGroup id='select-bundle' label={message('project.bundle')}>
          <Select
            id='select-bundle'
            getOptionLabel={b => b.name}
            getOptionValue={b => b._id}
            options={p.bundles.filter(b => b.status === 'DONE')}
            onChange={b => setBundleId(b._id)}
            placeholder={message('project.selectBundle')}
            value={p.bundles.find(b => b._id === bundleId)}
          />
        </FormGroup>
      ) : (
        <FormGroup>
          <p>{message('project.noBundles')}</p>
          <ButtonLink
            block
            href={{
              pathname: RouteTo.bundleCreate,
              query: router.query
            }}
            style='success'
          >
            <Icon icon={faPlus} /> {message('bundle.create')}
          </ButtonLink>
        </FormGroup>
      )}
      {!readyToCreate && (
        <p className='alert alert-danger'>
          <Icon icon={faExclamationCircle} />{' '}
          {message('project.createActionTooltip')}
        </p>
      )}
      <Button
        block
        disabled={!readyToCreate || creating}
        onClick={_create}
        style='success'
      >
        <Icon icon={faCheck} /> {message('common.create')}
      </Button>
    </InnerDock>
  )
}

export default React.memo(function ConnectedCreateProject(p) {
  const dispatch = useDispatch()
  const router = useRouter()

  return <CreateProject {...p} dispatch={dispatch} router={router} />
})
