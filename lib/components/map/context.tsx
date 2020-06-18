import {LeafletProvider} from 'react-leaflet'

/**
 * We do not use the LeafletProvider directly as the component needs to be dynamically loaded to avoid SSR.
 */
export default function ClientLeafletContextProvider({children, value}) {
  return <LeafletProvider value={value}>{children}</LeafletProvider>
}
