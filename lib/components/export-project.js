import {faDownload, faPrint} from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import {useSelector} from 'react-redux'

import message from 'lib/message'
import {
  downloadLines,
  downloadScenario,
  downloadStops
} from 'lib/utils/export-project'

import {Button, ButtonLink, Group as ButtonGroup} from './buttons'
import Icon from './icon'
import Modal, {ModalBody, ModalTitle} from './modal'
import P from './p'

function mapState(state) {
  const {feeds, modifications} = state.project
  return {feeds, modifications}
}

export default function ExportProject(p) {
  const {feeds, modifications} = useSelector(mapState)

  function _downloadLines(index) {
    downloadLines(p.project, modifications, index)
  }

  function _downloadScenario(index) {
    downloadScenario(p.project, feeds, modifications, index)
  }

  function _downloadStops(index) {
    downloadStops(p.project, modifications, index)
  }

  return (
    <Modal onRequestClose={p.onHide}>
      <ModalTitle>{message('variant.export')}</ModalTitle>
      <ModalBody>
        <P>{message('variant.exportExplanation')}</P>
        {p.project.variants.map((name, index) => (
          <div key={`export-${index}`}>
            <h6>
              {index + 1}. {name}
            </h6>
            <ButtonGroup justified>
              <Button style='info' onClick={() => _downloadScenario(index)}>
                <Icon icon={faDownload} /> {message('variant.saveJson')}
              </Button>
              <ButtonLink
                to='report'
                regionId={p.project.regionId}
                projectId={p.project._id}
                index={index}
                style='info'
              >
                <Icon icon={faPrint} /> {message('variant.print')}
              </ButtonLink>
            </ButtonGroup>
            <ButtonGroup justified>
              <Button style='info' onClick={() => _downloadLines(index)}>
                <Icon icon={faDownload} /> {message('variant.saveGeojson')}
              </Button>
              <Button style='info' onClick={() => _downloadStops(index)}>
                <Icon icon={faDownload} /> {message('variant.saveStops')}
              </Button>
            </ButtonGroup>
          </div>
        ))}
      </ModalBody>
    </Modal>
  )
}
