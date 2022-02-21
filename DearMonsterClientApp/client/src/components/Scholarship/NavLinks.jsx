import React from 'react'
import { Link } from 'react-router-dom';

const NavLinks = ({ match }) => {
    return (
        <nav className='text-white center mt-5 fs-17 border-bottom border-warning border-2 py-4'>
            <Link className='text-white me-7 center flex-column position-relative' to='/scholarship/manager'>
                <p>Manager</p>
                <img
                    src='/assets/imgs/arrow.png'
                    className={`position-absolute ${match.params.slug == 'manager' ? 'd-flex' : 'd-none'
                        } `}
                    style={{ top: '43px' }}
                    alt=''
                />
            </Link>
            <Link
                className='text-white me-7 center flex-column position-relative'
                to='/scholarship/on-scholar'
            >
                <p>On Scholar</p>
                <img
                    src='/assets/imgs/arrow.png'
                    className={`position-absolute ${match.params.slug == 'scholar' ? 'd-flex' : 'd-none'
                        } `}
                    style={{ top: '43px' }}
                    alt=''
                />
            </Link>
            <Link
                className='text-white me-7 center flex-column position-relative'
                to='/scholarship/got-scholar'
            >
                <p>Scholared</p>
                <img
                    src='/assets/imgs/arrow.png'
                    className={`position-absolute ${match.params.slug == 'scholared' ? 'd-flex' : 'd-none'
                        } `}
                    style={{ top: '43px' }}
                    alt=''
                />
            </Link>
        </nav>
    );
}

export default NavLinks
