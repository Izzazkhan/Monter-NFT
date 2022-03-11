import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { NavbarRoutes } from '../../routes/';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { connectUserSuccess } from '../../store/actions/auth/login';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import evmChains from 'evm-chains';
import Fortmatic from 'fortmatic';
import axios from 'axios'
import { apiUrl, appEnv, addressList } from '../../utils/constant'

import DMSToken from '../../contracts/DMSToken.json';
import DMSTokenTest from '../../contracts/DMSTokenTest.json';

const tokenContractAbi = appEnv === 'test' ? DMSTokenTest : DMSToken
const tokenContractAddress = appEnv === 'test' ? addressList.tokenAddressTest : addressList.tokenAddress

const Header = () => {

	const dispatch = useDispatch();

	const { userId } = useSelector((state) => state.auth);
	const { balance } = useSelector((state) => state.auth);

	let [provider, setProvider] = useState(null);
	const [active, setActive] = useState(false);
	const [blance, setBlance] = useState(0);
	const [web3Modal, setWeb3Modal] = useState(null);
	const [landingMsg, setLandingMsg] = useState('');

	const [walletConnected, setWalletConnected] = useState(false);
	const [account, setAccount] = useState([]);
	const [web3, setWeb3] = useState(0);

	useEffect(async () => {
		init();
	}, []);

	useEffect(async () => {

		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum)
			await window.ethereum.enable();
		}
		else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider)
			window.loaded_web3 = true
		}
		else {
			window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
		}

		let web3 = window.web3
		let accounts = await web3.eth.getAccounts()
		// let networkId = await web3.eth.net.getId()
		// let DMSTokenNetwork = DMSToken.networks[networkId]
		// let DMSTokenContract = new web3.eth.Contract(DMSToken.abi, DMSTokenNetwork.address)	


		let DMSTokenContract = new web3.eth.Contract(tokenContractAbi.abi, tokenContractAddress)


		DMSTokenContract.methods.balanceOf(accounts[0]).call().then(async function (bal) {
			setBlance(Math.floor(bal / (10 ** 18)));
		})
		function getMessage() {
			axios.get(`${apiUrl}/api/levelBonus`)
				.then((response) => {
					if (response?.data?.levelBonus) {
						setLandingMsg(response.data.levelBonus[0].message)
					}
					else {
						setLandingMsg('')
					}
				})
				.catch((error) => {
					console.log(error)
				})
		}
		getMessage()
	}, [userId, balance]);

	function init() {

		// Tell Web3modal what providers we have available.
		// Built-in web browser provider (only one can exist as a time)
		// like MetaMask, Brave or Opera is added automatically by Web3modal
		const providerOptions = {
			walletconnect: {
				package: WalletConnectProvider,
				options: {
				}
			}
		};

		let web3_Modal = new Web3Modal({
			cacheProvider: false, // optional
			providerOptions, // required
			disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
		});
		setWeb3Modal(web3_Modal)
	}

	async function fetchAccountData() {

		// // Get a Web3 instance for the wallet
		const web3 = new Web3(provider);
		setWeb3(web3);

		const accounts_temp = await web3.eth.getAccounts();

		console.log("Got accounts", accounts_temp);
		setAccount(accounts_temp[0])
		dispatch(connectUserSuccess(accounts_temp[0]))

		setWalletConnected(true);
	}

	async function refreshAccountData() {
		setWalletConnected(false);
		await fetchAccountData();
	}

	async function onConnect() {

		console.log("Opening a dialog", web3Modal);
		try {
			provider = await web3Modal.connect();
		} catch (e) {
			console.log("Could not get a wallet connection", e);
			return;
		}
		setProvider(provider);
		provider.on("accountsChanged", (accounts) => {
			fetchAccountData();
		});
		provider.on("chainChanged", (chainId) => {
			fetchAccountData();
		});
		provider.on("networkChanged", (networkId) => {
			fetchAccountData();
		});
		await window.ethereum.request({
			method: "wallet_requestPermissions",
			params: [{
				eth_accounts: {}
			}]
		});
		await refreshAccountData();
	}

	async function onDisconnect() {
		console.log("Killing the wallet connection", provider);

		setWalletConnected(false);
		dispatch(connectUserSuccess(null))
	}

	return (
		<section>
			<section className='container d-flex py-4 justify-content-between  align-items-center'>
				<Link to='/'>
					<img src='/assets/imgs/header/logo.png' alt='' className='w-90px' />
				</Link>
				<button className='btn d-lg-none d-flex' onClick={() => setActive(true)}>
					<img src='/assets/imgs/Hamburger.png' className='w-35px' alt='' />
				</button>
				<div
					className={`${active
						? 'position-fixed bg-dark top-0 w-100 w-100 start-0 vh-lg-auto vh-100'
						: 'd-none d-lg-flex align-items-center '
						} `}
					style={{ zIndex: '999' }}
				>
					<button
						className={`${active && 'd-flex-imp'} d-none btn m-3 me-2`}
						onClick={() => setActive(false)}
					>
						<img src='/assets/imgs/cancel.png' className='w-35px' alt='' />
					</button>
					<div
						className={`${active && 'show-navbar flex-lg-column mt-lg-8'
							} w-lg-auto d-lg-flex d-none flex-lg-row flex-column w-100 mt-8 mt-lg-5 justify-content-between align-items-center`}
					>
						{NavbarRoutes.map((route, index) => {
							return (
								!route.hidden ?
									<Link
										key={index}
										to={route.pathForNavabr}
										className={`header-btn text-warning ${!active && 'me-4'} w-auto mb-5`}
										onClick={() => setActive(false)}
									>
										<span className='mx-2'>{route.title}</span>
									</Link>
									:
									''
							);
						})}
					</div>
				</div>

				<div className='d-lg-flex d-none justify-content-between align-items-center'>
					<img src='/assets/imgs/coin.png' className='w-50px' />
					{userId && (
						<div className='dms-block h-40px ms-4 center px-2'>
							<div className='dms-btn w-100 me-2 center balance-div'>{Math.round(blance / 0.5) * 0.5}</div>
							<div className='dms-btn w-100  center'>DMS</div>
						</div>
					)}
					{!userId && (
						<div
							className={`${userId ? 'w-25' : 'px-5'
								} header-Connect-btn h-40px ms-4 center bold cursor`}
							onClick={onConnect}
						>
							Connect
						</div>
					)}
					{userId && (
						<div>
							<div className='dropdown ms-4'>
								<button
									className='btn dropdown-toggle fs-13 w-105px h-35px rounded-3 text-white border border-warning center'
									type='button'
									id='dropdownMenuButton1'
									data-bs-toggle='dropdown'
									aria-expanded='false'
								>
									{userId && `${userId.substring(0, 4)}...${userId.slice(-4)}`}
								</button>
								<ul
									className='dropdown-menu  w-sm dropdown-menu-end '
									aria-labelledby='dropdownMenuButton1'
								>
									{/* <li>
										<a className='dropdown-item py-5 text-whit cursor py-7px' href='#'>
											Wallet
										</a>
									</li>
									<li>
										<a className='dropdown-item py-5 text-whit cursor py-7px' href='#'>
											Transactions
										</a>
									</li>
									<li>
										<p className='dropdown-item py-5 text-whit cursor py-7px' href='#'>
											Your NFTs
										</p>
									</li>
									<li>
										<p className='dropdown-item py-5 text-whit cursor py-7px' href='#'>
											Make a Profile
										</p>
									</li> */}
									<li>
										<p className='dropdown-item py-5 text-whit cursor py-7px' href='#'
											onClick={onDisconnect}
										>
											Disconnect
										</p>
									</li>
								</ul>
							</div>
							<div className='mt-2'>
								<a
									target='_blank'
									href='https://pancakeswap.finance/swap?outputCurrency=0x9bfd1348cf574e3eb2b114cc18374b09ad012c69&inputCurrency=BNB'
									className='btn border position-absolute  center w-100px px-1 fs-12   mx-4  text-white cursor'
								>
									BUY DMS
								</a>
							</div>
						</div>
					)}
				</div>
			</section>
			<section>
				<div className='announcementBar  mt-3 h-30px py-2 fw-bold fs-17'>
					<div id='rssBlock '>
						<p className='cnnContents overflow-x-auto'>
							<span className='marqueeStyle  '>
								{landingMsg}
							</span>
						</p>
					</div>
				</div>
			</section>
		</section>
	);
}

export default Header