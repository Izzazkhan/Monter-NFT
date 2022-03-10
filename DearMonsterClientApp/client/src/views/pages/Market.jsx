import React, { useState, useEffect } from 'react';
import { connectUserSuccess, startLoading, stopLoading } from '../../store/actions/auth/login';
import CurrenPageTitle from '../../components/common/CurrenPageTitle';
import { useSelector, useDispatch } from 'react-redux';
import { apiUrl, appEnv, addressList } from '../../utils/constant'
import Web3 from 'web3';
import DMSExchangeTest from "../../contracts/DMSExchangeTest.json";
import DMSExchange from "../../contracts/DMSExchange.json";
import DMSToken from "../../contracts/DMSToken.json";
import DMSTokenTest from "../../contracts/DMSTokenTest.json";
import { notification } from "../../utils/notification";
import Swal from 'sweetalert2';
import axios from 'axios'

const DMSExchangeContractContractAbi = appEnv === 'test' ? DMSExchangeTest : DMSExchange
const DMSExchangeContractAddress = appEnv === 'test' ? addressList.DMSExchangeTest : addressList.DMSExchange

const tokenContractAbi = appEnv === 'test' ? DMSTokenTest : DMSToken
const tokenContractAddress = appEnv === 'test' ? addressList.tokenAddressTest : addressList.tokenAddress

const TradingPost = ({ }) => {
	const { userId } = useSelector(state => state.auth)
	const dispatch = useDispatch();
	const [account, setAccount] = useState();
	const [quantity, setQuantity] = useState(10);
    const [owner, setOwner] = useState(userId ? userId : null)
    const [extraTokens, setExtraToken] = useState(0);

	useEffect( () => {
		async function  getExtraToken() {
			let web3 = window.web3
			let DMSExchangeContract = new web3.eth.Contract(DMSExchangeContractContractAbi.abi, DMSExchangeContractAddress)
			const profit = await DMSExchangeContract.methods.getProfit().call()
			setExtraToken(profit)
		}
		getExtraToken()
		
	}, [])

	const handleConnect = async () => {
		await window.ethereum.request({
			method: "wallet_requestPermissions",
			params: [{
				eth_accounts: {}
			}]
		});
		let web3 = window.web3
		// Load account
		let accounts = await web3.eth.getAccounts()
		setOwner(accounts[0])
		dispatch(connectUserSuccess(accounts[0]))
	
	}

    const handlePurchase = async () => {

		dispatch(startLoading(true))
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
		setAccount(accounts[0]);

		if (true) {
			let DMSTokenContract = new web3.eth.Contract(tokenContractAbi.abi, tokenContractAddress)

			DMSTokenContract.methods.balanceOf(accounts[0]).call().then(async function (balance) {

				var _amount = Number(quantity * 10 ** 18)
				var amount = _amount.toLocaleString('fullwide', { useGrouping: false })
				if (_amount >= balance) {
					let notify = notification({
						type: 'error',
						message: 'Insufficient fund!'
					});
					dispatch(stopLoading(false))
					notify();
					return
				}

				try {
					await DMSTokenContract.methods.approve(DMSExchangeContractAddress, web3.utils.toBN(amount.toString())).send({ from: accounts[0] });
                    let DMSExchangeContract = new web3.eth.Contract(DMSExchangeContractContractAbi.abi, DMSExchangeContractAddress)
					await DMSExchangeContract.methods.deposit(web3.utils.toBN(amount.toString())).send({ from: accounts[0] });

                        axios.get(`${apiUrl}/api/userEarning/rewardByWallet/${userId}`)
                            .then((res) => {
                                const ownerReward = res.data.rewardByWallet.find(item => item.type === 'owner')
								let depositAmount 

                                if(ownerReward != undefined) {
									depositAmount = ownerReward.totalAmount + ( quantity * ( extraTokens / 100 ))
								} else {
									depositAmount = quantity * ( extraTokens / 100 )
								}
                                    const updateParams = new URLSearchParams()
                                    updateParams.append('earnerAddress', userId)
                                    updateParams.append('totalAmount', depositAmount)
									const config = {
										headers: {
											'Content-Type': 'application/x-www-form-urlencoded',
											'Authorization': `xx Umaaah haaalaaa ${process.env.REACT_APP_APP_SECRET} haaalaaa Umaaah xx`
										}
									}
                                    axios.put(`${apiUrl}/api/userEarning/${userId}/owner`, updateParams, config)
                                        .then((response) => {
                                            console.log('response owner', response)
                                            dispatch(stopLoading(false))
											Swal.fire({
												icon: 'success',
												title: 'Offline DMS ',
												text:  `You got ${quantity * ( extraTokens / 100 )} new DMS`
											})
                                        })
                                        .catch((error) => {
                                            console.log(error)
                                        })
                            })
                            .catch((e) => {
                                console.log("error: ", e);
                            })
				} catch (e) {
					dispatch(stopLoading(false))
					Swal.fire({
						icon: 'error',
						title: 'Error',
						text: 'Transaction was rejected from Metamask'
					})
					console.log("Error ----------------")
					console.log(e)
				}
			})
		}
	}

    const handleQuantityChange = (e) => {
		const { value } = e.target;
		setQuantity(value)
	}

	return (
		<div>
			<CurrenPageTitle title='Market'></CurrenPageTitle>
			<div className='container center mt-6'>
				<div className={`${userId && 'discoveryCaveBg'} py-2 w-md-lg2 w-md2 mb-8`}>
					<div className='center'>
						<img src='/assets/gif/Cave Animated.gif' alt='' className='w-75 mt-7' />
					</div>
					<div className='center fs-19 flex-column'>
						{userId &&
							<div className='center'>
								<div className='header-Connect-btn py-3 w-190px center bold fs-13'>
									You will get {`${extraTokens}%`} extra token
								</div>
							</div>
						}
						{userId &&
							<div className=' justify-content-between mt-6 mb-6 w-80 align-items-center text-white'>
								<p>Enter amount of token you want to buy</p>
								<div className='center mt-4'>
								<input
									type='number'
									name='quantity'
									className='form-control  w-100px'
									id='quantity'
									value={quantity}
									onChange={handleQuantityChange}
								/>
								</div>
							</div>
						}
						<footer className='center mt-4 flex align-items-center pb-4 mb-4'>
							{userId ? (
								<div>
									<div className='header-Connect-btn h-40px center w-100px px-4 fs-16 bold cursor'
										onClick={handlePurchase}
									>
										Deposit
									</div>
								</div>
							) : (
								<div
									className='header-Connect-btn h-40px center w-100px px-4 fs-16 bold cursor'
									onClick={handleConnect}
								>
									Connect
								</div>
							)}
						</footer>
					</div>
			</div>
		</div>
	</div>
	);
};

export default TradingPost;
