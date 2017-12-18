// @flow
import get from 'lodash/get'

export default function (o: any, p: string, d: any) {
  const value = get(o, p, d)
  return value === null ? d : value
}
