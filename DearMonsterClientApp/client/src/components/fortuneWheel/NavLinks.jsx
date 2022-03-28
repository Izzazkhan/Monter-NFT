import React from 'react'
import { Link } from 'react-router-dom';

const NavLinks = ({ match }) => {
    return (
        <nav className='text-white center mt-5 fs-17 border-bottom border-warning border-2 py-4'>
            <Link className='text-white me-7 center flex-column position-relative' to='/fortune-wheel/owned'>
                <p>Owned</p>
                <img
                    src='/assets/imgs/arrow.png'
                    className={`position-absolute ${match.params.slug == 'owned' ? 'd-flex' : 'd-none'
                        } `}
                    style={{ top: '43px' }}
                    alt=''
                />
            </Link>
            <Link
                className='text-white me-7 center flex-column position-relative'
                to='/fortune-wheel/scholar' >
                <p>Scholar</p>
                <img
                    src='/assets/imgs/arrow.png'
                    className={`position-absolute ${match.params.slug == 'scholar' ? 'd-flex' : 'd-none'
                        } `}
                    style={{ top: '43px' }}
                    alt=''
                />
            </Link>
        </nav>
    );
}

export default NavLinks
