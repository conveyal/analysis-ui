import {
  Alert,
  AlertDescription,
  Box,
  Button,
  Flex,
  Stack
} from '@chakra-ui/core'
import {faMap, faSignOutAlt} from '@fortawesome/free-solid-svg-icons'

import useRouteTo from 'lib/hooks/use-route-to'
import useUser from 'lib/hooks/use-user'
import message from 'lib/message'

import Icon from './icon'
import ListGroupItem from './list-group-item'
import {ALink} from './link'
import Logo from './logo'

const alertDate = 'August, 2020'
const alertText =
  'Run regional analyses with multiple cutoffs, percentiles, and opportunity datasets all at once.'

export default function SelectRegion(p) {
  const {accessGroup, email} = useUser()
  const goToRegionCreate = useRouteTo('regionCreate')

  return (
    <Flex alignItems='center' mb={6} direction='column'>
      <Box mt={8} mb={6}>
        <Logo />
      </Box>
      <Stack spacing={4} textAlign='center' width='320px'>
        <Box>
          <span>signed in as </span>
          <strong>
            {email} ({accessGroup})
          </strong>
        </Box>
        <Alert status='warning' borderRadius='4px'>
          <AlertDescription>
            <strong>{alertDate}</strong> — <span>{alertText} </span>
            <ALink to='changelog'>Click here to learn more.</ALink>
          </AlertDescription>
        </Alert>
        <Button
          isFullWidth
          leftIcon='small-add'
          onClick={goToRegionCreate}
          variantColor='green'
        >
          {message('region.createAction')}
        </Button>
        {p.regions.length > 0 && <Box>{message('region.goToExisting')}</Box>}
        {p.regions.length > 0 && (
          <Stack spacing={0}>
            {p.regions.map((region) => (
              <RegionItem key={region._id} region={region} />
            ))}
          </Stack>
        )}
        <Box>
          <ALink to='logout'>
            <Icon icon={faSignOutAlt} /> {message('authentication.logOut')}
          </ALink>
        </Box>
      </Stack>
    </Flex>
  )
}

function RegionItem({region, ...p}) {
  const goToRegion = useRouteTo('projects', {regionId: region._id})
  return (
    <ListGroupItem
      {...p}
      leftIcon={() => (
        <Box pr={3}>
          <Icon icon={faMap} />
        </Box>
      )}
      onClick={goToRegion}
    >
      {region.name}
    </ListGroupItem>
  )
}
