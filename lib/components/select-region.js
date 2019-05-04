import {
  faMap,
  faPlus,
  faSignOutAlt,
  faSpinner
} from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import React, {Component} from 'react'

import {RouteTo} from 'lib/constants'
import message from 'lib/message'

import Icon from './icon'

export default function SelectRegion(p) {
  return (
    <div className='center-block' style={{width: '375px'}}>
      <div className='page-header text-center' style={{borderBottom: 'none'}}>
        <h1 className='Logo'>conveyal analysis</h1>
      </div>
      <Link href={RouteTo.regionCreate}>
        <a className='btn btn-success btn-block'>
          <Icon icon={faPlus} /> {message('region.createAction')}
        </a>
      </Link>
      {p.regions.length > 0 && (
        <>
          <br />
          <p className='text-center'>{message('region.goToExisting')}</p>
          <div className='list-group'>
            {p.regions.map(region => (
              <Link
                href={{
                  pathname: RouteTo.projects,
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
                      <Icon icon={faMap} /> {region.name}
                    </>
                  ) : (
                    <>
                      <p>
                        <Icon icon={faSpinner} spin /> {region.name}
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
        <Link href={RouteTo.logout}>
          <a>
            <Icon icon={faSignOutAlt} /> {message('authentication.logOut')}
          </a>
        </Link>
      </div>
    </div>
  )
}
