import {
  faCog,
  faCube,
  faDownload,
  faPrint,
  faShareAltSquare
} from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import React from 'react'

import message from '../message'

import {Title} from './base'
import {Button, Group as ButtonGroup} from './buttons'
import {RouteTo} from '../constants'
import Icon from './icon'
import Modal, {ModalBody, ModalTitle} from './modal'
import Tip from './tip'

export default function ProjectTitle(p) {
  const [showExportSelect, setShowExportSelect] = React.useState(false)
  const name = p.project ? p.project.name : 'Loading...'
  return (
    <Title>
      <Icon icon={faCube} fixedWidth /> {name}
      {p.project && (
        <>
          <Tip className='pull-right' tip={message('project.editSettings')}>
            <Link
              href={{
                pathname: RouteTo.projectSettings,
                query: {
                  regionId: p.project.regionId,
                  projectId: p.project._id
                }
              }}
            >
              <a>
                <Icon icon={faCog} fixedWidth />
              </a>
            </Link>
          </Tip>
          <Tip className='pull-right' tip={message('project.export')}>
            <a onClick={() => setShowExportSelect(true)}>
              <Icon icon={faShareAltSquare} fixedWidth />
            </a>
          </Tip>
          {showExportSelect && (
            <SelectScenarioModal
              onHide={() => setShowExportSelect(false)}
              {...p}
            />
          )}
        </>
      )}
    </Title>
  )
}

function SelectScenarioModal(p) {
  return (
    <Modal onRequestClose={p.onHide}>
      <ModalTitle>{message('variant.export')}</ModalTitle>
      <ModalBody>
        <p>{message('variant.exportExplanation')}</p>
        {p.project.variants.map((name, index) => (
          <div key={`export-${index}`}>
            <h6>
              {index + 1}. {name}
            </h6>
            <ButtonGroup justified>
              <Button style='info' onClick={() => p.downloadScenario(index)}>
                <Icon icon={faDownload} fixedWidth />{' '}
                {message('variant.saveJson')}
              </Button>
              <Link
                href={{
                  pathname: RouteTo.reports,
                  query: {
                    regionId: p.project.regionId,
                    projectId: p.project._id,
                    index
                  }
                }}
              >
                <Button style='info'>
                  <Icon icon={faPrint} fixedWidth /> {message('variant.print')}
                </Button>
              </Link>
            </ButtonGroup>
            <ButtonGroup justified>
              <Button style='info' onClick={() => p.downloadLines(index)}>
                <Icon icon={faDownload} fixedWidth />{' '}
                {message('variant.saveGeojson')}
              </Button>
              <Button style='info' onClick={() => p.downloadStops(index)}>
                <Icon icon={faDownload} fixedWidth />{' '}
                {message('variant.saveStops')}
              </Button>
            </ButtonGroup>
          </div>
        ))}
      </ModalBody>
    </Modal>
  )
}
