import {
  Alert,
  AlertDescription,
  Box,
  Button,
  Flex,
  Skeleton,
  Stack
} from '@chakra-ui/core'
import {faMap, faSignOutAlt} from '@fortawesome/free-solid-svg-icons'
import {GetServerSideProps} from 'next'
import useSWR from 'swr'

import {getSession} from 'lib/auth0'
import Icon from 'lib/components/icon'
import ListGroupItem from 'lib/components/list-group-item'
import {ALink} from 'lib/components/link'
import Logo from 'lib/components/logo'
import useRouteTo from 'lib/hooks/use-route-to'
import useUser from 'lib/hooks/use-user'
import withAuth from 'lib/with-auth'

const alertDate = 'August, 2020'
const alertText =
  'Run regional analyses with multiple cutoffs, percentiles, and opportunity datasets all at once.'

function SelectRegion() {
  const {data: regions, isValidating} = useSWR('/api/regions')
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
          Set up a new region
        </Button>
        {!regions && isValidating && <Skeleton height='30px' />}
        {regions && regions.length > 0 && (
          <Box>or go to an existing region</Box>
        )}
        {regions && regions.length > 0 && (
          <Stack spacing={0}>
            {regions.map((region) => (
              <RegionItem key={region._id} region={region} />
            ))}
          </Stack>
        )}
        <Box>
          <ALink to='logout'>
            <Icon icon={faSignOutAlt} /> Log out
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

// Require authentication
export default withAuth(SelectRegion)

/**
 * Take additional steps to attempt a fast page load since this is the first page most people will see.
 * Comment out to disable. Everything else should still work.
 */
export const getServerSideProps: GetServerSideProps = async ({req, res}) => {
  let session = null
  try {
    session = await getSession(req)
  } catch (e) {
    console.error('Error while retrieving the session.', e)
  }
  if (session == null) {
    res.writeHead(302, {
      Location: '/api/login'
    })
    res.end()
    return
  }

  return {
    props: {
      user: session
    }
  }
}
