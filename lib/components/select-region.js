import {
  faMap,
  faPlus,
  faSignOutAlt,
  faSpinner
} from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import React from 'react'

import {RouteTo} from 'lib/constants'
import message from 'lib/message'

import Icon from './icon'
import Logo from './logo'

const Container = p => (
  <div className='container'>
    <div className='row'>
      <div className='col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3'>
        {p.children}
      </div>
    </div>
  </div>
)

export default function SelectRegion(p) {
  return (
    <Container>
      <Logo />
      <p>
        <Link href={RouteTo.regionCreate} prefetch>
          <a className='btn btn-success btn-block'>
            <Icon icon={faPlus} /> {message('region.createAction')}
          </a>
        </Link>
      </p>
      {p.regions.length > 0 && (
        <>
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
      <p className='text-center'>
        <Link href={RouteTo.logout}>
          <a>
            <Icon icon={faSignOutAlt} /> {message('authentication.logOut')}
          </a>
        </Link>
      </p>
    </Container>
  )
}
