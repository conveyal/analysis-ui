import React, { Component, PropTypes } from 'react'
import Dock from 'react-dock'
import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import * as actionCreators from './actions'
import {authIsRequired} from './auth0'
import {Button, Group} from './components/buttons'
import messages from './messages'
import Navbar from './navbar'
import Scenario from './scenario'
import transitDataSource from './transit-data-source'
import ScenarioMap from './map/scenario-map'
import './map.css'

function mapStateToProps (state) {
  return {
    bundleId: state.scenario.bundleId,
    data: state.scenario.data,
    id: state.scenario.id,
    mapState: state.mapState,
    modifications: state.scenario.modifications,
    name: state.scenario.name,
    projects: state.scenario.projects,
    user: state.user,
    variants: state.scenario.variants
  }
}

const mapDispatchToProps = Object.assign({}, actionCreators, { push })

class ScenarioEditor extends Component {
  static defaultProps = {
    variants: ['Default']
  }

  static propTypes = {
    children: PropTypes.any,
    user: PropTypes.object,
    // actions
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    setProject: PropTypes.func.isRequired,
    setMapState: PropTypes.func.isRequired,
    replaceModification: PropTypes.func.isRequired,
    deleteModification: PropTypes.func.isRequired,
    updateVariants: PropTypes.func.isRequired,

    // state
    data: PropTypes.object.isRequired,
    mapState: PropTypes.object.isRequired,
    projects: PropTypes.array.isRequired,
    variants: PropTypes.array.isRequired,

    bundleId: PropTypes.string,
    id: PropTypes.string,
    modifications: PropTypes.object,
    name: PropTypes.string
  }

  state = {
    dockWidth: 0.3
  }

  getDataAndReplaceModification = (modification) => {
    const {bundleId, modifications} = this.props
    transitDataSource.getDataForModifications({ modifications: [...modifications.values(), modification], bundleId })
    this.props.replaceModification(modification)
  }

  render () {
    console.log('rendering')
    const {bundleId, data, login, logout, mapState, modifications, name, push, updateVariants, setMapState, user} = this.props
    const bundle = data.bundles.find((b) => b.id === bundleId)
    const bundleName = bundle && bundle.name
    return (
      <div>
        <div
          className='Fullscreen'
          style={{
            width: `${(1 - this.state.dockWidth) * 100}%`
          }}
          >
          <ScenarioMap
            bundle={bundle}
            data={data}
            mapState={mapState}
            modifications={modifications}
            replaceModification={this.getDataAndReplaceModification}
            setMapState={setMapState}
            updateVariants={updateVariants}
            />
        </div>

        <Dock
          dimMode='none'
          fluid
          isVisible
          position='right'
          onSizeChange={(dockWidth) => {
            this.setState({dockWidth})
          }}
          size={this.state.dockWidth}
          zIndex={2499}
          >

          <div className='DockContent'>
            <Navbar
              authIsRequired={authIsRequired}
              bundleName={bundleName}
              login={login}
              logout={logout}
              messages={messages}
              projectName={name}
              user={user}
              />

            <Group justified>
              <Button onClick={() => push('/select-project')}>{messages.nav.openProject}</Button>
              <Button onClick={() => push('/import-shapefile')}>{messages.nav.importShapefile}</Button>
              <Button onClick={() => push('/create-bundle')}>{messages.nav.createBundle}</Button>
              <Button onClick={() => push('/select-bundle')}>{messages.nav.selectBundle}</Button>
            </Group>

            {this.renderScenario()}

            {this.props.children}
          </div>
        </Dock>
      </div>
    )
  }

  renderScenario () {
    const {bundleId, data, deleteModification, id, mapState, modifications, variants, name, updateVariants, setMapState} = this.props
    if (id && bundleId) {
      return <Scenario
        projectName={name}
        bundleId={bundleId}
        data={data}
        deleteModification={deleteModification}
        mapState={mapState}
        modifications={modifications}
        replaceModification={this.getDataAndReplaceModification}
        setMapState={setMapState}
        updateVariants={updateVariants}
        variants={variants}
        />
    } else {
      return <div className='alert alert-info'>Select or create a project and bundle!</div>
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScenarioEditor)
