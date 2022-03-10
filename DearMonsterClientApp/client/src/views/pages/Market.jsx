import React, { useState, useEffect } from 'react';
import { connectUserSuccess, startLoading, stopLoading } from '../../store/actions/auth/login';
import CurrenPageTitle from '../../components/common/CurrenPageTitle';
import { useSelector, useDispatch } from 'react-redux';
import { apiUrl, appEnv, addressList } from '../../utils/constant'
import Web3 from 'web3';
import DMSExchangeTest from "../../contracts/DMSExchange.json";
import DearMonster from '../../contracts/DearMonster.json';
import DMSToken from "../../contracts/DMSToken.json";
import DearMonsterTest from '../../contracts/DearMonsterTest.json';
import DMSTokenTest from "../../contracts/DMSTokenTest.json";
import { notification } from "../../utils/notification";
import Swal from 'sweetalert2';
import axios from 'axios'

const DMSExchangeContractContractAbi = appEnv === 'test' ? DMSExchangeTest : DMSExchangeTest
const DMSExchangeContractAddress = appEnv === 'test' ? addressList.DMSExchangeTest : addressList.DMSExchange

const tokenContractAbi = appEnv === 'test' ? DMSTokenTest : DMSToken
const nftContractAbi = appEnv === 'test' ? DearMonsterTest : DearMonster

const tokenContractAddress = appEnv === 'test' ? addressList.tokenAddressTest : addressList.tokenAddress
const nftContractAddress = appEnv === 'test' ? addressList.nftAddressTest : addressList.nftAddress

const TradingPost = ({ }) => {
	const { userId } = useSelector(state => state.auth)
	const dispatch = useDispatch();
	const [account, setAccount] = useState();
	const [quantity, setQuantity] = useState(10);
    const [owner, setOwner] = useState(userId ? userId : null);

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
					const approveReturned = await DMSTokenContract.methods.approve(DMSExchangeContractAddress, web3.utils.toBN(amount.toString())).send({ from: accounts[0] });
                    let DMSExchangeContract = new web3.eth.Contract(DMSExchangeContractContractAbi.abi, DMSExchangeContractAddress)
					const amountReturned = await DMSExchangeContract.methods.deposit(web3.utils.toBN(amount.toString())).send({ from: accounts[0] });

                        axios.get(`${apiUrl}/api/userEarning/rewardByWallet/${userId}`)
                            .then((res) => {
                                const ownerReward = res.data.rewardByWallet.find(item => item.type === 'owner')
								let depositAmount 

                                if(ownerReward != undefined) {
									depositAmount = ownerReward.totalAmount + quantity
								} else {
									depositAmount = quantity
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
			<div className='mt-lg-9 mt-7 container '>
				<div className='row  px-md-auto justify-content-center'>
					<div className='col-md-5 col-lg-3 col-12'>
						
					</div>
					<div className='col-lg-9 col-md-7 col-12'>
						<div className='px-md-0'>
						</div>
						
					</div>
				</div>
                { userId &&
                    <div className='center mt-6'>
                                {/* <p>Select quantity</p> */}
                                <input
                                    type='number'
                                    name='quantity'
                                    className='form-control  w-100px'
                                    id='quantity'
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                />
                    </div>
                }
			</div>

            <footer className='center mt-6'>
				{userId ?
					
                    (
                        <div className='header-Connect-btn h-40px center w-100px px-2 bold  cursor'
                            onClick={handlePurchase}>
                            Deposit
                        </div>
                    )
					:
					(
						<div
							className='header-Connect-btn h-40px center w-100px px-2 bold  cursor'
							onClick={handleConnect}
						>
							Connect
						</div>
					)
				}
			</footer>
		</div>
	);
};

export default TradingPost;
