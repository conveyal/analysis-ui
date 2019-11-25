import {Box, Flex, Stack} from '@chakra-ui/core'
import {
  faMap,
  faPlus,
  faSignOutAlt,
  faSpinner
} from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import {useSelector} from 'react-redux'

import message from 'lib/message'
import selectRegions from 'lib/selectors/regions'

import A from './a'
import {ButtonLink} from './buttons'
import Icon from './icon'
import Link from './link'
import Logo from './logo'

export default function SelectRegion(p) {
  const regions = useSelector(selectRegions)

  return (
    <Flex alignItems='center' direction='column'>
      <Box mt='8' mb='6'>
        <Logo />
      </Box>
      <Stack spacing='4' textAlign='center' width='320px'>
        <Box>
          <ButtonLink to='regionCreate' style='success' block>
            <Icon icon={faPlus} /> {message('region.createAction')}
          </ButtonLink>
        </Box>
        {regions.length > 0 && <Box>{message('region.goToExisting')}</Box>}
        {regions.length > 0 && (
          <Box className='list-group'>
            {regions.map(region => (
              <Link key={region._id} regionId={region._id} to='projects'>
                <a
                  className='list-group-item'
                  title={message('region.goToRegion')}
                >
                  {region.statusCode === 'DONE' ? (
                    <span>
                      <Icon icon={faMap} /> {region.name}
                    </span>
                  ) : (
                    <>
                      <p>
                        <Icon icon={faSpinner} spin /> {region.name}
                      </p>
                      <em>
                        {message(`region.statusCode.${region.statusCode}`)}
                      </em>
                    </>
                  )}
                </a>
              </Link>
            ))}
          </Box>
        )}
        <Box>
          <Link to='logout'>
            <A>
              <Icon icon={faSignOutAlt} /> {message('authentication.logOut')}
            </A>
          </Link>
        </Box>
      </Stack>
    </Flex>
  )
}
