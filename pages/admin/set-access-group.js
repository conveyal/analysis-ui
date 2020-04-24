import {Button, Flex, Input, Stack, Text} from '@chakra-ui/core'
import Cookie from 'js-cookie'
import React from 'react'

import withAuth from 'lib/with-auth'

const key = 'adminTempAccessGroup'

export default withAuth(function SetAccessGroup(p) {
  const inputRef = React.useRef()
  const [accessGroup, setAccessGroup] = React.useState(() => Cookie.get(key))

  function setGroup() {
    const newGroup = inputRef.current.value
    setAccessGroup(newGroup)
    Cookie.set(key, newGroup)
    window.location = '/'
  }

  return (
    <Flex alignItems='center' direction='column'>
      <Stack width='300px' mt='10'>
        <Text>
          Current access group is: <strong>{accessGroup}</strong>
        </Text>
        <Input ref={inputRef} placeholder='Set access group' />
        <Button onClick={setGroup}>
          Set group and redirect to the home page
        </Button>
      </Stack>
    </Flex>
  )
})
