// @flow
import {createDrawTile, colorizers, interpolators} from '@conveyal/gridualizer'
import {GridLayer} from 'leaflet'
import {MapLayer} from 'react-leaflet'

import type {Grid} from '../../types'

type Props = {
  breaks: number[],
  colors: string[],
  grid: Grid
}

type State = {
  colorizer(): void,
  grid: {},
  interpolator(): void
}

export default class GridualizerLayer extends MapLayer<void, Props, State> {
  state = {
    colorizer: colorizers.choropleth(this.props.breaks, this.props.colors),
    grid: this.props.grid,
    interpolator: interpolators.bicubic
  }

  createLeafletElement (props: Props): Object {
    const gridLayer = new GridLayer()
    gridLayer.createTile = this.createTile
    return gridLayer
  }

  componentWillReceiveProps (nextProps: Props) {
    if (
      this.props.colors !== nextProps.colors ||
      this.props.breaks !== nextProps.breaks
    ) {
      this.setState({
        colorizer: colorizers.choropleth(this.props.breaks, this.props.colors)
      })
    }
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
