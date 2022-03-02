import { useState } from 'react'
import { Link } from 'react-router-dom'
import useToken from '../hooks/useToken'
import Web3 from 'web3';
import { useSelector, useDispatch } from 'react-redux';
import { connectUserSuccess } from '../redux/WalletAuth/login';

const Header = (props) => {

    const dispatch = useDispatch()
    const { token } = useToken()
    const [currentUser] = useState(JSON.parse(localStorage.getItem('token')))
    const logOut = () => {
        localStorage.removeItem('token')
    }
    const {userId} = useSelector((state) => state.AuthReducer)

    const connectWallet = async () => {
        if (window.ethereum) {
			window.web3 = new Web3(window.ethereum)
			await window.ethereum.enable();
		} else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider)
			window.loaded_web3 = true
		} else {
			window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
		}

		await window.ethereum.request({
			method: "wallet_requestPermissions",
			params: [{
				eth_accounts: {}
			}]
		});
		let web3 = window.web3
		// Load account
		let accounts = await web3.eth.getAccounts()
		// setAccount(accounts[0]);

		dispatch(connectUserSuccess(accounts[0]))
    }

    return (
        <header id="header">
            <div className="container-fluid main-menu">
                <div className="row">
                    <nav className="navbar navbar-expand-lg w-100 fixed-top main-padding">
                        <h5 className='nav-padding'>Dear Monsters </h5>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown"
                            aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon fa fa-bars"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNavDropdown">
                            {/* <ul className="navbar-nav ml-auto">

                                <li className="nav-item active">
                                    <a className="nav-link hvr-float-shadow " href='/login'>Login </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link hvr-float-shadow" href="/register">Sign Up</a>
                                </li>
                            </ul> */}
                        </div>
                        <div className="custom-items">
                            {currentUser ?
                                <>
                                    <button className="btn-default">
                                        <span className="icon"> </span>
                                        {currentUser.user.firstName + ' ' + currentUser.user.lastName}
                                    </button>
                                    <a className="nav-link hvr-float-shadow" href="/login">
                                        <button className="btn-default hvr-bounce-in" onClick={logOut}>
                                            <span className="icon"></span>{'Log Out'}
                                        </button>
                                    </a>
                                    {userId ?
                                        <button className="btn-default">
                                        <span className="icon"> </span>
                                        {userId && `${userId.substring(0, 4)}...${userId.slice(-4)}`}
                                    </button>

                                    :
                                    <button className="btn-default" onClick={connectWallet}>
                                        <span className="icon"> </span>
                                        {'Connect Wallet'}
                                    </button>
                                   } 
                                </>
                                :
                                <>
                                    {/* <Link to='/login'>
                                        <button className="btn-default hvr-bounce-in"><span className="icon">
                                        </span>Login</button>
                                    </Link>
                                    <Link to='/register'>
                                        <button className="btn-default hvr-bounce-in"><span className="icon">
                                        </span>Sign Up</button>
                                    </Link> */}
                                </>}
                            <div className="flags-dropdown btn-group">
                                <button type="button" className="btn" data-toggle="dropdown" aria-haspopup="true"
                                    aria-expanded="false">
                                </button>
                                <div className="dropdown-menu">
                                    <a className="dropdown-item" href="#"><img className="img-fluid" src="img/flag.png"
                                        alt="Flag" /></a>
                                    <a className="dropdown-item" href="#"><img className="img-fluid" src="img/flag.png"
                                        alt="Flag" /></a>
                                    <a className="dropdown-item" href="#"><img className="img-fluid" src="img/flag.png"
                                        alt="Flag" /></a>
                                </div>
                            </div>
                            {/* <div className="mobile login-signup">
                                <div className="account-dropdown btn-group">
                                    <button type="button" className="btn dropdown-toggle" data-toggle="dropdown"
                                        aria-haspopup="true" aria-expanded="false">
                                        <span className="img fa fa-user"></span>Humaz
                                    </button>
                                    <div className="dropdown-menu">
                                        <a href="dashboard.html" className="dropdown-item active" role="button">Profile</a>
                                        <a href="messages.html" className="dropdown-item" role="button">Messages</a>
                                        <a href="create-store.html" className="dropdown-item" role="button">Create a Store</a>
                                        <a href="#" className="dropdown-item" role="button">Disconnect my wallet</a>
                                        <a href="#" className="dropdown-item" role="button">Help</a>
                                        <a href="#" className="dropdown-item" role="button">Log out</a>
                                        <a href="#" className="dropdown-item" role="button">Suggest a feature</a>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    )
}

export default Header