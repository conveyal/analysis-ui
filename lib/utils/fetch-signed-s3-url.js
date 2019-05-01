import fetch from '../fetch-action'

/**
 * We redirect to S3, and due to a bug in Chrome 57, the auth header is
 * forwarded and S3 chokes on that. So we make the request again without the
 * auth header. There's no way to get the URL of the redirect without following
 * it due to browser security restrictions. Do this here so that each request is
 * chained individually, otherwise the signed URLs can expire while we are
 * waiting for other responses.
 *
 * Must be DISPATCHED
 */
export const fetchSignedS3Url = url => async dispatch => {
  const value = await dispatch(fetch({url: `${url}?redirect=false`}))
  return dispatch(
    fetch({
      url: value.url,
      options: {
        headers: {
          Authorization: null
        }
      }
    })
  )
}
