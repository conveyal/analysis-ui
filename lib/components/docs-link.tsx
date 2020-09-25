import {Link, Tooltip} from '@chakra-ui/core'
import {faQuestionCircle} from '@fortawesome/free-solid-svg-icons'

import Icon from './icon'

const docsBaseURL = 'https://docs.conveyal.com'

export default function DocsLink({to}) {
  return (
    <Tooltip hasArrow aria-label='learn-more' label='Learn more' zIndex={1500}>
      <Link href={`${docsBaseURL}/${to}`} isExternal>
        <Icon icon={faQuestionCircle} />
      </Link>
    </Tooltip>
  )
}
