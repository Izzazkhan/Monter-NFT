import { Link } from 'react-router-dom'
const NavigationMenu = (props) => {
    console.log('navigation', props)
    return (
        <div className="col-lg-3 col-md-4">
            <div className="sidebar">
                <div className="profile">
                    <div className="profile-info">
                        <h5>Admin Panel</h5>
                    </div>
                </div>
                <hr />
                <Link to='/monsters'>
                    <div className="other-info">
                        <button className="btn-default hvr-bounce-in" data-toggle="modal" data-target=".create-item"><span
                            className="icon fas fa-plus"></span>Monsters List</button>
                    </div>
                </Link>
                <Link to='/minions'>
                    <div className="other-info">
                        <button className="btn-default hvr-bounce-in" data-toggle="modal" data-target=".create-item"><span
                            className="icon fas fa-plus"></span>Minions List</button>
                    </div>
                </Link>
                <hr />
                {/* <div className="links-list">
                    <ul>

                        <li>
                            <Link to='/monsters'>
                                <span className="icon fas fa-home"></span>Dear Monsters
                            </Link>
                        </li>
                        <li>
                            <Link to='/minions'>
                                <span className="icon fas fa-home"></span>Minions
                            </Link>
                        </li>
                    </ul>
                </div>
                <hr /> */}
                <div className="other-info">
                    <a className="btn-default hvr-bounce-in"><span
                        className="icon fas fa-cog"></span>Settings</a>
                    <a className="btn-default hvr-bounce-in"><span className="icon fas fa-sign-out-alt"></span>Log
                        out</a>
                </div>
            </div>
        </div>
    )
}

export default NavigationMenu