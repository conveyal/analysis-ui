
/**
 * `toFixed` leaves `0`'s at the end and converts to a String.
 *
 * @param {Number} n
 * @param {Number} precision
 * @return {Number}
 */

export function toPrecision (n, precision = 2) {
  const factor = Math.pow(10, precision)
  return Math.round(n * factor) / factor
}
