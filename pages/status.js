import React from 'react'

import {API_URL} from 'lib/constants'
import P from 'lib/components/p'
import fetch from 'lib/utils/fetch'

export default function Status() {
  const [serverOk, setServerOk] = React.useState(false)
  const [serverStatus, setServerStatus] = React.useState('Unknown')

  // On component mount
  React.useEffect(() => {
    let timeoutId = null

    function pingApi() {
      const startTime = new Date()
      fetch(`${API_URL}/version`)
        .then(async res => {
          if (res.ok) {
            const body = await res.json()
            setServerOk(true)
            setServerStatus({
              ...body,
              responseTime: (new Date() - startTime) / 1000 + 's'
            })
          } else {
            setServerOk(false)
            setServerStatus(res.status)
          }
        })
        .catch(e => {
          setServerOk(false)
          setServerStatus(String(e))
        })
        .finally(() => {
          timeoutId = setTimeout(pingApi, 10000)
        })
    }

    pingApi()

    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-xs-12'>
          <br />
          <div className='jumbotron'>
            <h1>Conveyal Status</h1>
            <P>
              <strong>Client:</strong> <span className='text-success'>OK</span>
            </P>
            <P>
              <strong>Server: </strong>
              <pre className={serverOk ? 'text-success' : 'text-danger'}>
                {JSON.stringify(serverStatus, null, '\t')}
              </pre>
            </P>
          </div>
        </div>
      </div>
    </div>
  )
}
