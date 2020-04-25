import httpProxy from 'http-proxy'
import omit from 'lodash/omit'
import {NextApiRequest, NextApiResponse} from 'next'
import qs from 'querystring'

const proxy = httpProxy.createProxyServer({
  prependPath: false, // use target pased in
  secure: false // skip SSL validation
})

// Close proxy when lambda closes
process.on('exit', () => proxy.close())

// API_URL set now.json
const API_URL = process.env.API_URL

/**
 * Proxy the incoming request to the Java API server.
 */
export default function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const accessGroup = req.cookies.adminTempAccessGroup
    const idToken = JSON.parse(req.cookies.user).idToken
    const headers = {
      Authorization: `bearer ${idToken}`
    }
    if (accessGroup != null) {
      headers['X-Conveyal-Access-Group'] = accessGroup
    }
    const {proxyTarget} = req.query
    const forwardedQueryString = qs.stringify(omit(req.query, 'proxyTarget'))
    const url = API_URL + proxyTarget + '?' + forwardedQueryString
    req.url = url
    proxy.web(req, res, {headers, target: url})
  } catch (e) {
    res.statusCode = 401
    res.status(401).json({status: 'Unauthorized', error: e.message})
  }
}
