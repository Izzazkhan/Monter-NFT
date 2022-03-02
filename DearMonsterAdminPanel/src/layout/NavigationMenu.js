import { Link } from 'react-router-dom'
const NavigationMenu = (props) => {
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
                        <button className="nav-button btn-default hvr-bounce-in nav-button" data-toggle="modal" data-target=".create-item">Monsters List</button>
                    </div>
                </Link>
                <Link to='/minions'>
                    <div className="other-info">
                        <button className="btn-default hvr-bounce-in nav-button" data-toggle="modal" data-target=".create-item"><span
                            className="icon fas fa-plus"></span>Minions List</button>
                    </div>
                </Link>
                <hr />
                <Link to='/withdraw-request'>
                    <div className="other-info">
                        <button className="btn-default hvr-bounce-in nav-button" data-toggle="modal" data-target=".create-item"><span
                            className="icon fas fa-plus"></span>Withdraw Request</button>
                    </div>
                </Link>
                <Link to='/additional-reward'>
                    <div className="other-info">
                        <button className="btn-default hvr-bounce-in nav-button" data-toggle="modal" data-target=".create-item"><span
                            className="icon fas fa-plus"></span>Additional Reward</button>
                    </div>
                </Link>
                <Link to='/fight-history'>
                    <div className="other-info">
                        <button className="btn-default hvr-bounce-in nav-button" data-toggle="modal" data-target=".create-item"><span
                            className="icon fas fa-plus"></span>Fight History</button>
                    </div>
                </Link>
                <Link to='/side-setting'>
                    <div className="other-info">
                        <button className="btn-default hvr-bounce-in nav-button" data-toggle="modal" data-target=".create-item"><span
                            className="icon fas fa-plus"></span>Side Setting</button>
                    </div>
                </Link>
                <Link to='/forget-password'>
                    <div className="other-info">
                        <button className="btn-default hvr-bounce-in nav-button" data-toggle="modal" data-target=".create-item"><span
                            className="icon fas fa-plus"></span>Change Password</button>
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
                {/* <div className="other-info">
                    <a className="btn-default hvr-bounce-in"><span
                        className="icon fas fa-cog"></span>Settings</a>
                    <a className="btn-default hvr-bounce-in"><span className="icon fas fa-sign-out-alt"></span>Log
                        out</a>
                </div> */}
            </div>
        </div>
    )
}

export default NavigationMenu