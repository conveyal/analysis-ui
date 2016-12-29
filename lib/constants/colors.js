/** Colors for scenario editor, pulled out as constants in one place */

/** Colors used across the scenario editor */

let colors = {
  /** removed things are red */
  REMOVED: '#b66',

  /** added things are blue (not green as red/green color blindness is very common) */
  ADDED: '#55b',

  /** edited things are purple, because it's @mattwigway's favorite color */
  MODIFIED: '#d6d',

  /** active things (i.e. the user is hovering their mouse over them) are green */
  ACTIVE: '#4a4',

  /** neutral things are gray */
  NEUTRAL: '#747880',

  /** The color of the isochrone */
  SCENARIO_ISOCHRONE_COLOR: '#2389c9',

  /** When performing a comparison, the color of the comparison isochrone */
  COMPARISON_ISOCHRONE_COLOR: '#f42727',

  /** The color of stale isochrones (invalidated by parameter changes) */
  STALE_ISOCHRONE_COLOR: '#ababab',

  /** The middle color stop on the spectrogram for the scenario being analyzed */
  SCENARIO_SPECTROGRAM_COLOR: '#2043f9',

  /** The middle color stop on the spectrogram for the scenario being compared against */
  COMPARISON_SPECTROGRAM_COLOR: '#ff2b2b',

  /** The middle stop for a spectrogram invalidated by parameter changes */
  STALE_SPECTROGRAM_COLOR: '#a8a8a8',

  /** Color of the dot density maps */
  OPPORTUNITY_COLOR: '#b4c248',

  /** Color gradient for regional analysis results, blues from Colorbrewer */
  REGIONAL_GRADIENT: ['#f1eef6', '#bdc9e1', '#74a9cf', '#2b8cbe', '#045a8d'],

  /** Color gradient for regional analysis comparisons */
  REGIONAL_COMPARISON_GRADIENT: ['#d7191c', '#fdae61', '#ffffbf', '#abd9e9', '#2c7bb6']
}

export default colors
