import {faExclamationCircle} from '@fortawesome/free-solid-svg-icons'

import Icon from './icon'
import Tip from './tip'

const _hover = {color: 'yellow.700'}

export default function WarningNote({msg}) {
  return (
    <Tip label={`${msg}`}>
      <Icon 
        icon={faExclamationCircle} 
        color='yellow.500'
        _hover={_hover}
      />
    </Tip>
  )
}
