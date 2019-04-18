// @flow
import {createDrawTile, colorizers, interpolators} from '@conveyal/gridualizer'
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

function createCreateTile (props: Props) {
  let drawTile = () => {}

  if (props.grid) {
    drawTile = createDrawTile({
      colorizer: props.colorizer || colorizers.choropleth(props.breaks, props.colors),
      grid: props.grid,
      interpolator: props.interpolator || interpolators.bicubic
    })
  }

  return function createTile (coords) {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 256
    drawTile(canvas, coords, coords.z)
    return canvas
  }
}

export class GridualizerLayer extends GridLayer {
  props: Props

  createLeafletElement (props: Props) {
    const gridLayer = super.createLeafletElement(props)
    gridLayer.createTile = createCreateTile(props)
    return gridLayer
  }

  shouldComponentUpdate (nextProps) {
    const p = this.props
    return p.grid !== nextProps.grid ||
      p.colorizer !== nextProps.colorizer ||
      p.breaks !== nextProps.breaks ||
      p.interpolator !== nextProps.interpolator
  }

  componentDidUpdate () {
    this.leafletElement.createTile = createCreateTile(this.props)
    this.leafletElement.redraw()
  }
}

export default withLeaflet(GridualizerLayer)
