//

export function isLight(c) {
  const yiq = (c.r * 299 + c.g * 587 + c.b * 114) / 1000
  return yiq >= 128
}
