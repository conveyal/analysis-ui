import {
  faCog,
  faCube,
  faShareAltSquare
} from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import React from 'react'

import {RouteTo} from 'lib/constants'
import message from 'lib/message'

import ExportProject from './export-project'
import Icon from './icon'
import Tip from './tip'

export default function ProjectTitle(p) {
  const [showExportSelect, setShowExportSelect] = React.useState(false)
  const name = p.project ? p.project.name : 'Loading...'
  return (
    <div className='ApplicationDockTitle'>
      <Icon icon={faCube} /> {name}
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
                <Icon icon={faCog} />
              </a>
            </Link>
          </Tip>
          <Tip className='pull-right' tip={message('project.export')}>
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
        </>
      )}
    </div>
  )
}
