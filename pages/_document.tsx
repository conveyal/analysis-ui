import Document, {Html, Head, Main, NextScript} from 'next/document'
import React from 'react'

import {LOGO_URL} from 'lib/constants'

const Stylesheets = () => (
  <>
    <link rel='stylesheet' href='/static/bootstrap.min.css' />
    <link rel='stylesheet' href='/static/leaflet/leaflet.css' />
    <link rel='stylesheet' href='/static/leaflet-draw/leaflet.draw.css' />
    <link rel='stylesheet' href='/static/mapbox-gl.css' />
    <link rel='stylesheet' href='/static/fontawesome.css' />
  </>
)

export default class ConveyalDocument extends Document {
  render(): JSX.Element {
    return (
      <Html>
        <Head>
          <link rel='shortcut icon' href={LOGO_URL} type='image/x-icon' />
          <Stylesheets />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
