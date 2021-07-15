import {
  Badge,
  Box,
  Flex,
  Heading,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast
} from '@chakra-ui/react'
import {useEffect} from 'react'
import useSWR from 'swr'

import {API} from 'lib/constants'

import JobDashboard from 'lib/components/admin-job-dashboard'
import TextLink from 'lib/components/text-link'
import WorkerList from 'lib/components/admin-worker-list'
import useUser from 'lib/hooks/use-user'
import authFetch from 'lib/utils/auth-fetch'
import {ResponseError} from 'lib/utils/safe-fetch'
import withAuth from 'lib/with-auth'

// Refresh every five seconds
const refreshInterval = 5000

// Fetcher
async function fetcher<T>(url: string, user: CL.User) {
  const res = await authFetch<T>(url, user)
  if (res.ok === false) throw res
  return res.data
}

const EMPTY_ARRAY = []

function useRegionalJobs() {
  const toast = useToast({status: 'error'})
  const {user} = useUser()
  const jobRequest = useSWR<CL.RegionalJob[], ResponseError>(
    [API.Jobs, user],
    fetcher,
    {
      refreshInterval
    }
  )

  useEffect(() => {
    if (jobRequest.error) {
      toast({
        title: 'Error loading regional jobs',
        description: jobRequest.error.error.message
      })
    }
  }, [jobRequest, toast])

  return Array.isArray(jobRequest.data)
    ? jobRequest.data.filter((j) => j.graphId !== 'SUM')
    : EMPTY_ARRAY
}

function useRegionalWorkers() {
  const {user} = useUser()
  const workersRequest = useSWR<CL.RegionalWorker[]>(
    [API.Workers, user],
    fetcher,
    {refreshInterval}
  )

  return workersRequest.data ?? EMPTY_ARRAY
}

const isAdmin = (user?: CL.User) =>
  user && user.accessGroup === process.env.NEXT_PUBLIC_ADMIN_ACCESS_GROUP

function useIsAdmin() {
  const toast = useToast({status: 'error'})
  const {user} = useUser()
  useEffect(() => {
    if (isAdmin(user) === false) {
      toast({
        title: 'Access denied',
        description: 'You must be an admin to access this page.'
      })
    }
  }, [toast, user])
}

export default withAuth(function AdminDashboard() {
  useIsAdmin()

  const jobs = useRegionalJobs()
  const workers = useRegionalWorkers()

  return (
    <Flex p={16}>
      <Stack spacing={4} mr={10}>
        <Heading>ADMIN</Heading>
        <TextLink href='/'>Regions</TextLink>
        <TextLink href='/admin/set-access-group'>Set access group</TextLink>
      </Stack>
      <Box flex='1'>
        <Tabs isFitted>
          <TabList>
            <Tab>
              Jobs{' '}
              <Badge ml='2' rounded='full'>
                {jobs.length}
              </Badge>
            </Tab>
            <Tab>
              Workers{' '}
              <Badge ml='2' rounded='full'>
                {workers.length}
              </Badge>
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel p={0}>
              <JobDashboard jobs={jobs} workers={workers} />
            </TabPanel>
            <TabPanel p={0}>
              <WorkerList workers={workers} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Flex>
  )
})
