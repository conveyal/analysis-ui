// @flow
import {createDrawTile, colorizers, interpolators} from '@conveyal/gridualizer'
import {GridLayer} from 'leaflet'
import {MapLayer} from 'react-leaflet'

import type {Grid} from '../../types'

type Interpolator = (Grid, number, number) => (number) => number

type Props = {
  breaks?: number[],
  colors?: string[],
  colorizer?: number => number[],
  interpolator: Interpolator,
  grid: Grid
}

type State = {
  colorizer: number => number[],
  grid: Grid,
  interpolator: Interpolator,
  drawTile: () => void
}

function createCreateDrawTile (props: Props) {
  return createDrawTile({
    colorizer: props.colorizer || colorizers.choropleth(props.breaks, props.colors),
    grid: props.grid,
    interpolator: props.interpolator || interpolators.bicubic
  })
}

export default class GridualizerLayer extends MapLayer {
  props: Props
  state: State

  state = {
    drawTile: createCreateDrawTile(this.props)
  }

  componentWillReceiveProps (nextProps: Props) {
    if (this.props.colors !== nextProps.colors ||
      this.props.breaks !== nextProps.breaks ||
      this.props.grid !== nextProps.grid ||
      this.props.interpolator !== nextProps.interpolator) {
      this.setState({
        drawTile: createCreateDrawTile(nextProps)
      })
    }
  }

  createLeafletElement (props: Props): Object {
    const gridLayer = new GridLayer()
    gridLayer.createTile = this.createTile
    return gridLayer
  }

  componentDidUpdate () {
    this.leafletElement.redraw()
  }

  shouldComponentUpdate (nextProps: Props, nextState: State) {
    return nextState.drawTile !== this.state.drawTile
  }

  createTile = (coords: {x: number, y: number, z: number}) => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 256
    this.state.drawTile(canvas, coords, coords.z)
    return canvas
  }
}
