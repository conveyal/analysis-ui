import createStore from '@conveyal/woonerf/store'
import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {browserHistory} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'

if (process.env.LOGROCKET) {
  const LogRocket = require('logrocket')
  LogRocket.init(process.env.LOGROCKET)
}

export function create ({
  app,
  reducers
}) {
  const store = createStore(reducers)
  const history = process.env.NODE_ENV !== 'test'
    ? syncHistoryWithStore(browserHistory, store)
    : {}
  return React.createElement(Provider, {store},
    React.createElement(app, {history, store}))
}

export default function mount ({
  app,
  id = 'root',
  reducers
}) {
  return render(
    create({app, reducers}),
    document.getElementById(id)
  )
}
