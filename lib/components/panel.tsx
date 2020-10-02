import {Box, Flex, useDisclosure} from '@chakra-ui/core'
import {faCaretDown, faCaretRight} from '@fortawesome/free-solid-svg-icons'

import Icon from './icon'

export function Panel({children}) {
  return (
    <Box borderWidth='1px' shadow='xs'>
      {children}
    </Box>
  )
}

export function Collapsible({defaultExpanded = true, children, heading}) {
  const {isOpen, onToggle} = useDisclosure(defaultExpanded)

  return (
    <Panel>
      <Heading onClick={onToggle} style={{cursor: 'pointer'}}>
        <Box>{heading}</Box>
        <Box>
          <Icon icon={isOpen ? faCaretDown : faCaretRight} />
        </Box>
      </Heading>
      {isOpen && children}
    </Panel>
  )
}

export function Heading({children, ...p}) {
  return (
    <Flex role='button' bg='gray.50' justify='space-between' p={4} {...p}>
      {children}
    </Flex>
  )
}

export function Body({children, ...p}) {
  return (
    <Box p={4} {...p}>
      {children}
    </Box>
  )
}
