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
  Tabs
} from '@chakra-ui/react'
import useSWR from 'swr'

import {API} from 'lib/constants'

import JobDashboard from 'lib/components/admin-job-dashboard'
import TextLink from 'lib/components/text-link'
import WorkerList from 'lib/components/admin-worker-list'
import withAuth from 'lib/with-auth'
import useUser from 'lib/hooks/use-user'

// Refresh every five seconds
const refreshInterval = 5000

// Fetcher
const fetcher = (url: string, user: CL.User) =>
  fetch(url, {
    headers: {
      Authorization: `bearer ${user.idToken}`
    }
  }).then((res) => res.json())

const EMPTY_ARRAY = []

function useRegionalJobs() {
  const {user} = useUser()
  const jobRequest = useSWR<CL.RegionalJob[]>([API.Jobs, user], fetcher, {
    refreshInterval
  })
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

export default withAuth(function AdminDashboard() {
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
