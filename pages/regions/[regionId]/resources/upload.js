import React from 'react'

import InnerDock from 'lib/components/inner-dock'
import getInitialAuth from 'lib/get-initial-auth'

export default function UploadResource(p) {
  return (
    <InnerDock className='block'>
      <legend>Upload Resource</legend>
    </InnerDock>
  )
}

UploadResource.getInitialProps = getInitialAuth
