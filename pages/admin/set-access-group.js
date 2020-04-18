import {Button, Flex, Input, Stack, Text} from '@chakra-ui/core'
import Cookie from 'js-cookie'
import nextCookies from 'next-cookies'
import React from 'react'

import getInitialAuth from 'lib/get-initial-auth'

const key = 'adminTempAccessGroup'

export default function Results(p) {
  const inputRef = React.useRef()
  const [accessGroup, setAccessGroup] = React.useState(p.accessGroup)

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
}

Results.getInitialProps = (ctx) => {
  getInitialAuth(ctx)
  const userAccessGroup = ctx.store.getState().user.accessGroup
  return {accessGroup: nextCookies(ctx)[key] || userAccessGroup}
}
