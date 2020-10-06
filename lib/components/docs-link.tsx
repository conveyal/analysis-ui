import {Link} from '@chakra-ui/core'
import {faQuestionCircle} from '@fortawesome/free-solid-svg-icons'

import Icon from './icon'
import Tip from './tip'

const docsBaseURL = 'https://docs.conveyal.com'
const _hover = {color: 'blue.700'}

export default function DocsLink({to}) {
  return (
    <Tip label='View docs to learn more'>
      <Link
        color='blue.500'
        href={`${docsBaseURL}/${to}`}
        isExternal
        _hover={_hover}
      >
        <Icon icon={faQuestionCircle} />
      </Link>
    </Tip>
  )
}
