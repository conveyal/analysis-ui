import {Coords, DoneCallback, GridLayer as LeafletGridLayer} from 'leaflet'
import {GridLayer, GridLayerProps, withLeaflet} from 'react-leaflet'

function createCreateTile(props) {
  return function createTile(coords) {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 256
    props.drawTile(canvas, coords, coords.z)
    return canvas
  }
}

class MutableGridLayer extends LeafletGridLayer {
  _createTile: (coords: Coords, done: DoneCallback) => HTMLElement

  constructor(options) {
    super(options)
    this._createTile = options.createTile
  }

  createTile(coords: Coords, done: DoneCallback) {
    return this._createTile(coords, done)
  }
}

interface GridualizerLayerProps extends GridLayerProps {
  drawTile: (canvas: HTMLCanvasElement, coords: Coords, z: number) => void
}

export class GridualizerLayer extends GridLayer<
  GridualizerLayerProps,
  MutableGridLayer
> {
  createLeafletElement(props: GridualizerLayerProps) {
    return new MutableGridLayer({createTile: createCreateTile(props)})
  }
}

export default withLeaflet(GridualizerLayer)
