import get from 'lodash/get'

import initAuth0 from '../../lib/auth0'

export default async function login(req, res) {
  try {
    const auth0 = initAuth0(req)
    const session = await auth0.getSession(req)
    await auth0.handleLogin(req, res, {
      authParams: {
        login_hint: get(session, 'user.name')
      },
      redirectTo: req.query.redirectTo
    })
  } catch (error) {
    console.error(error)
    res.status(error.status || 500).end(error.message)
  }
}
