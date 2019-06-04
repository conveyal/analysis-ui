import Document, {Html, Head, Main, NextScript} from 'next/document'
import React from 'react'

import {LOGO_URL} from 'lib/constants'

const CDN = () => (
  <>
    <link
      rel='stylesheet'
      href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'
    />
    <link
      rel='stylesheet'
      href='https://unpkg.com/leaflet@1.5.1/dist/leaflet.css'
    />
  </>
)

const LocalStylesheets = () => (
  <>
    <link rel='stylesheet' href='/static/bootstrap.min.css' />
    <link rel='stylesheet' href='/static/leaflet/leaflet.css' />
  </>
)

export default class extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel='shortcut icon' href={LOGO_URL} type='image/x-icon' />
          {process.env.NODE_ENV === 'production' ? (
            <CDN />
          ) : (
            <LocalStylesheets />
          )}
          <link rel='stylesheet' href='/static/react-datetime.css' />
          <link rel='stylesheet' href='/static/fontawesome.css' />
          <link rel='stylesheet' href='/static/styles.css' />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
