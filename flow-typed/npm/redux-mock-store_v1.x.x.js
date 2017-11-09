// flow-typed signature: f701a18dad7dd178883101bd2f24167b
// flow-typed version: <<STUB>>/redux-mock-store_v^1.2.1/flow_>=v0.25.x

declare module 'redux-mock-store' {
  declare export default (middleware: Array) => (any) => {
    dispatch: (any) => any,
    getState(): any
  }
}
