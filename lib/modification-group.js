import React from 'react'
import toSentenceCase from 'to-sentence-case'

import {Button} from './components/buttons'
import Icon from './components/icon'
import Title from './components/dock-content-title'
import Modification from './modification'

const ModificationGroup = ({
  create,
  modifications,
  scenarioProps,
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
        {modifications.map((modification) =>
          <Modification
            {...scenarioProps} // TODO: remove when modifications are smart components
            id={modification.id}
            key={modification.id}
            modification={modification}
            />
        )}
      </div>
    </div>
  )
}

export default ModificationGroup
