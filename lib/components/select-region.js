import {
  faMap,
  faPlus,
  faSignOutAlt,
  faSpinner
} from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import {useSelector} from 'react-redux'

import message from 'lib/message'
import selectRegions from 'lib/selectors/regions'

import Icon from './icon'
import Link from './link'
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
  const regions = useSelector(selectRegions)

  return (
    <Container>
      <Logo />
      <p>
        <Link to='regionCreate'>
          <a className='btn btn-success btn-block'>
            <Icon icon={faPlus} /> {message('region.createAction')}
          </a>
        </Link>
      </p>
      {regions.length > 0 && (
        <>
          <p className='text-center'>{message('region.goToExisting')}</p>
          <div className='list-group'>
            {regions.map(region => (
              <Link key={region._id} regionId={region._id} to='projects'>
                <a
                  className='list-group-item'
                  title={message('region.goToRegion')}
                >
                  {region.statusCode === 'DONE' ? (
                    <span>
                      <Icon icon={faMap} /> {region.name}
                    </span>
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
      <p className='text-center' style={{marginBottom: '40px'}}>
        <Link to='logout'>
          <a>
            <Icon icon={faSignOutAlt} /> {message('authentication.logOut')}
          </a>
        </Link>
      </p>
    </Container>
  )
}
