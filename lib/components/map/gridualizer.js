// @flow
import {createDrawTile, colorizers, interpolators} from '@conveyal/gridualizer'
import isEqual from 'lodash/isEqual'
import {GridLayer, withLeaflet} from 'react-leaflet'

import type {Grid} from '../../types'

type Interpolator = (Grid, number, number) => (number) => number

type Props = {
  breaks?: number[],
  colorizer?: number => number[],
  colors?: string[],
  grid: Grid,
  interpolator: Interpolator
}

type State = {
  colorizer: number => number[],
  drawTile: null | () => void,
  grid: Grid,
  interpolator: Interpolator
}

function createCreateDrawTile (props: Props) {
  if (!props.grid) return () => {}

  return createDrawTile({
    colorizer: props.colorizer || colorizers.choropleth(props.breaks, props.colors),
    grid: props.grid,
    interpolator: props.interpolator || interpolators.bicubic
  })
}

export class GridualizerLayer extends GridLayer {
  props: Props
  state: State

  constructor (props) {
    super(props)
    this._drawTile = createCreateDrawTile(props)
  }

  createLeafletElement (props: Props): Object {
    const gridLayer = super.createLeafletElement(props)
    gridLayer.createTile = this.createTile
    return gridLayer
  }

  componentDidUpdate (prevProps) {
    if (!isEqual(prevProps, this.props)) {
      this._drawTile = createCreateDrawTile(this.props)
      this.leafletElement.redraw()
    }
  }

  createTile = (coords: {x: number, y: number, z: number}) => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 256
    this._drawTile(canvas, coords, coords.z)
    return canvas
  }
}

export default withLeaflet(GridualizerLayer)
