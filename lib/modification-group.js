import React from 'react'
import toSentenceCase from 'to-sentence-case'

import {Button} from './components/buttons'
import Icon from './components/icon'
import Title from './components/dock-content-title'
import Modification from './modification'

const ModificationGroup = ({
  create,
  modificationIds,
  type
}) => {
  return (
    <div className='ModificationGroup'>
      <Title>{toSentenceCase(type)}
        <Button
          className='pull-right'
          onClick={() => create(type)}
          style='success'
          ><Icon type='plus' /> Create
        </Button>
      </Title>
      <div>
        {modificationIds && modificationIds.map((id) =>
          <Modification
            id={id}
            key={`modification-${id}`}
            />
        )}
      </div>
    </div>
  )
}

export default ModificationGroup
