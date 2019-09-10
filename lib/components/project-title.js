import {
  faCog,
  faCube,
  faShareAltSquare
} from '@fortawesome/free-solid-svg-icons'
import React from 'react'

import message from 'lib/message'

import ExportProject from './export-project'
import Icon from './icon'
import Link from './link'
import Tip from './tip'

export default function ProjectTitle(p) {
  const [showExportSelect, setShowExportSelect] = React.useState(false)
  const name = p.project ? p.project.name : 'Loading...'
  return (
    <div className='ApplicationDockTitle'>
      <div>
        <Icon icon={faCube} /> {name}
      </div>
      {p.project && (
        <div>
          <Tip tip={message('project.editSettings')}>
            <Link
              to='projectSettings'
              regionId={p.project.regionId}
              projectId={p.project._id}
            >
              <a>
                <Icon icon={faCog} />
              </a>
            </Link>
          </Tip>
          <Tip tip={message('project.export')}>
            <a
              onClick={() => setShowExportSelect(true)}
              name={message('project.export')}
            >
              <Icon icon={faShareAltSquare} />
            </a>
          </Tip>
          {showExportSelect && (
            <ExportProject
              onHide={() => setShowExportSelect(false)}
              project={p.project}
            />
          )}
        </div>
      )}
    </div>
  )
}
