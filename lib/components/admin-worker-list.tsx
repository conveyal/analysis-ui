import {Box, Flex} from '@chakra-ui/react'

import Worker from './admin-worker'

export default function AdminWorkerList(p: {workers: CL.RegionalWorker[]}) {
  return p.workers.length === 0 ? (
    <Box textAlign='center' mt='5'>
      <em>no active workers</em>
    </Box>
  ) : (
    <Flex justify='center' wrap='wrap' mt='5'>
      {p.workers.map((w) => (
        <Box key={w.workerId} mr='2' mb='2'>
          <Worker worker={w} />
        </Box>
      ))}
    </Flex>
  )
}
