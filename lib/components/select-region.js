import {
  faMap,
  faPlus,
  faSignOutAlt,
  faSpinner
} from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import React, {Component} from 'react'

import {PATHS} from '../constants'
import message from '../message'

import Icon from './icon'

export default function SelectRegion(p) {
  // On mount
  React.useEffect(() => {
    p.clearCurrentRegion()
    p.loadAllRegions()
  }, [])

  return (
    <div className='Welcome'>
      <div className='WelcomeTitle'>
        <div className='logo'>conveyal analysis</div>
      </div>
      <Link href={PATHS.regionCreate}>
        <a className='btn btn-success btn-block'>
          <Icon fixedWidth icon={faPlus} /> {message('region.createAction')}
        </a>
      </Link>
      {p.regions.length > 0 && (
        <>
          <br />
          <p className='center'>{message('region.goToExisting')}</p>
          <div className='list-group'>
            {p.regions.map(region => (
              <Link
                href={{
                  pathname: PATHS.projects,
                  query: {regionId: region._id}
                }}
                key={region._id}
              >
                <a
                  className='list-group-item'
                  title={message('region.goToRegion')}
                >
                  {region.statusCode === 'DONE' ? (
                    <>
                      <Icon fixedWidth icon={faMap} /> {region.name}
                    </>
                  ) : (
                    <>
                      <p>
                        <Icon fixedWidth icon={faSpinner} spin /> {region.name}
                      </p>
                      <em>
                        {message(`region.statusCode.${region.statusCode}`)}
                      </em>
                    </>
                  )}
                </a>
              </Link>
            ))}
          </div>
        </>
      )}
      <div className='center'>
        <Link href='/logout'>
          <a>
            <Icon fixedWidth icon={faSignOutAlt} />{' '}
            {message('authentication.logOut')}
          </a>
        </Link>
      </div>
    </div>
  )
}
