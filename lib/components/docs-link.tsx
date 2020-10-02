import {Link} from '@chakra-ui/core'
import {faQuestionCircle} from '@fortawesome/free-solid-svg-icons'

import Icon from './icon'
import Tip from './tip'

const docsBaseURL = 'https://docs.conveyal.com'

export default function DocsLink({to}) {
  return (
    <Tip label='Learn more'>
      <Link href={`${docsBaseURL}/${to}`} isExternal>
        <Icon icon={faQuestionCircle} />
      </Link>
    </Tip>
  )
}
