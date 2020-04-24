import initAuth0 from '../../lib/auth0'

export default (req, res) => {
  const auth0 = initAuth0(req)
  auth0.requireAuthentication(async (req, res) => {
    try {
      const session = await auth0.getSession(req)
      res.json(session)
    } catch (error) {
      console.error(error)
      res.status(error.status || 500).end(error.message)
    }
  })(req, res)
}
