// Query values are typed as string OR string[]
export function getQueryAsString(p: string | string[]): string {
  return Array.isArray(p) ? p[0] : p
}

// Get a query as an object
export function getQueryAsObject(
  p: string | string[]
): Record<string, unknown> {
  try {
    return JSON.parse(getQueryAsString(p))
  } catch (e) {
    return {}
  }
}

// Convert an error to POJO for sending over the wire
export function errorToPOJO(e: Error): Record<string, unknown> {
  const obj = {}
  Object.getOwnPropertyNames(e).forEach((k) => {
    obj[k] = e[k]
  })
  return obj
}
