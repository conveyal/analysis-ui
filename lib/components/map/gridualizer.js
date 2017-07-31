// @flow
import {createDrawTile, interpolators} from '@conveyal/gridualizer'
import {GridLayer} from 'leaflet'
import {MapLayer} from 'react-leaflet'

import type {Grid} from '../../types'

type Props = {
  colorizer(): void,
  grid: Grid,
  interpolator(): void
}

export default class GridualizerLayer extends MapLayer<Props, Props, void> {
  static defaultProps = {
    interpolator: interpolators.bicubic
  }

  createLeafletElement (props: Props): Object {
    const gridLayer = new GridLayer()
    gridLayer.createTile = this.createTile
    return gridLayer
  }

  componentDidUpdate () {
    this.leafletElement.redraw()
  }

  createTile = (coords: {
    x: number,
    y: number,
    z: number
  }) => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 256
    createDrawTile(this.props)(canvas, coords, coords.z)
    return canvas
  }
}
