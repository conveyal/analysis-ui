import get from 'lodash/get'

import auth0 from '../../lib/auth0'

/**
 * TODOs:
 *  - Handle redirects
 *  - Pass existing email address from session to pre-populate form
 */
export default async function login(req, res) {
  try {
    const session = await auth0.getSession(req)
    console.log('LOGIN SESSION', session)
    console.log('LOGIN REDIRECT TO', req.query.redirectTo)

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
