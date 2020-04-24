import auth0 from '../../lib/auth0'

export default async function callback(req, res) {
  try {
    console.log('CALLBACK > REDIRECT TO', req.query.redirectTo)
    await auth0.handleCallback(req, res, {
      redirectTo: req.query.redirectTo
    })
  } catch (error) {
    console.error(error)
    res.status(error.status || 500).end(error.message)
  }
}
