// @flow
import {createDrawTile, colorizers, interpolators} from '@conveyal/gridualizer'
import {GridLayer} from 'leaflet'
import {MapLayer} from 'react-leaflet'

import type {Grid} from '../../types'

type Interpolator = (Grid, number, number) => (number) => number

type Props = {
  breaks?: number[],
  colors?: string[],
  colorizer?: (number) => number[],
  interpolator: Interpolator,
  grid: Grid
}

type State = {
  colorizer: (number) => number[],
  grid: Grid,
  interpolator: Interpolator
}

export default class GridualizerLayer extends MapLayer {
  props: Props
  state: State

  state = {
    colorizer: this.props.colorizer || colorizers.choropleth(this.props.breaks, this.props.colors),
    grid: this.props.grid,
    interpolator: this.props.interpolator || interpolators.bicubic
  }

  componentWillReceiveProps (nextProps: Props) {
    this.setState({
      colorizer: nextProps.colorizer || colorizers.choropleth(nextProps.breaks, nextProps.colors),
      grid: nextProps.grid,
      interpolator: nextProps.interpolator || interpolators.bicubic
    })
  }

  createLeafletElement (props: Props): Object {
    const gridLayer = new GridLayer()
    gridLayer.createTile = this.createTile
    return gridLayer
  }

  shouldComponentUpdate (nextProps: Props) {
    return this.props.colors !== nextProps.colors ||
      this.props.breaks !== nextProps.breaks ||
      this.props.grid !== nextProps.grid ||
      this.props.interpolator !== nextProps.interpolator
  }

  componentDidUpdate () {
    this.leafletElement.redraw()
  }

  createTile = (coords: {x: number, y: number, z: number}) => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 256
    createDrawTile(this.state)(canvas, coords, coords.z)
    return canvas
  }
}
