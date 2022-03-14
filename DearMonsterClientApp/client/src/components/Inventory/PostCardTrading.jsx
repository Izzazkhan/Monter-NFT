import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { connectUserSuccess, startLoading, stopLoading } from '../../store/actions/auth/login';
import Web3 from 'web3';
import axios from 'axios'
import Swal from 'sweetalert2';

import DearMonster from '../../contracts/DearMonster.json';
import DearMonsterTest from '../../contracts/DearMonsterTest.json';

import { apiUrl, appEnv, addressList } from '../../utils/constant'

import DearMonsterTrading from '../../contracts/DearMonsterTrading.json';
import DearMonsterTradingTest from '../../contracts/DearMonsterTradingTest.json';

const tradingContractAbi = appEnv === 'test' ? DearMonsterTradingTest : DearMonsterTrading
const tradingContractAddress = appEnv === 'test' ? addressList.tradingAddressTest : addressList.tradingAddress

const config = {
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Authorization': `xx Umaaah haaalaaa ${process.env.REACT_APP_APP_SECRET} haaalaaa Umaaah xx`
	}
}

const PostCard = ({ className, getData, post, stepImg, account }) => {
	console.log('post ====', post)

	const [owner, setOwner] = useState(null);
	const { userId } = useSelector(state => state.auth)
	const dispatch = useDispatch();


	const connectFunction = async () => {
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

	const revokeSellFunction = async () => {

		dispatch(startLoading(true))

		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum)
			await window.ethereum.enable();
		} else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider)
			window.loaded_web3 = true
		} else {
			window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
		}
		let web3 = window.web3
		const accounts = await web3.eth.getAccounts()

		const TradingContract = new web3.eth.Contract(tradingContractAbi.abi, tradingContractAddress)

		// let DearMonsterContract = new web3.eth.Contract(DearMonster.abi, "0xf5ba121b8e4c89e4090feC0E262b8Af17Bedc776")
		// // await DearMonsterContract.methods.setApprovalForAll(TradingContract._address, true).send({ from: accounts[0] });
		// await DearMonsterContract.methods.approve(TradingContract._address, post.id).send({ from: accounts[0] });

		try {
			const transaction = await TradingContract.methods.removeTrade(post.id).send({ from: accounts[0] })

			if (transaction.status) {
				axios.delete(`${apiUrl}/api/tradeItem/${post.tradeId}`, {
					headers: {
						'Authorization': `xx Umaaah haaalaaa ${process.env.REACT_APP_APP_SECRET} haaalaaa Umaaah xx`
					}
				}).then((res) => {
					getData(userId)
					dispatch(stopLoading(false))
					Swal.fire({
						icon: 'success',
						title: 'Item Removed From Trading',
						text: 'Please check Inventory Trading for items on trade!'
					})

					let newParams = new URLSearchParams()
						newParams.append('name', 'Monster removed from trading')
						newParams.append('type', 'tradeMonster')
						newParams.append('activityDetails.tradeItemId', post.tradeId)
						newParams.append('activityDetails.mintedMonsterId', post.mintedId)
						axios.post(`${apiUrl}/api/activity`, newParams, config)
							.then((res) => {
								console.log('Activity has been created')
							})
							.catch((e) => {
								console.log(e)
							})

				}).catch((e) => {
					console.log("error: ", e);
					dispatch(stopLoading(false))
					Swal.fire({
						icon: 'error',
						title: 'Error',
						text: 'Oops, Something went wrong, Please contact admin!'
					})
				})
			}
			else {
				dispatch(stopLoading(false))
				Swal.fire({
					icon: 'error',
					title: 'Transaction',
					text: 'Transaction error'
				})
			}
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
	}


	return (
		<div className={`${className}`}>
			<header className='center mb-3'>
				<div className='header-Connect-btn h-25px center px-1 w-90px fs-12'>{post?.id}</div>
			</header>
			<main className='center flex-column'>
				<div>
					<img src={post?.img} className='w-md2' />
				</div>
				<div className='findDearMonster w-100   h-100 py-4 ' style={{ marginTop: '-55px' }}>
					<p className='text-center mt-47px fs-18 bold'>{post?.title}</p>
					<div className='center mt-5'>
						<div>
							{[...Array(post?.totalRating)].map((e, i) => {
								return (
									<img
										src={
											post?.rating <= i ? '/assets/imgs/dimStar.png' : '/assets/imgs/star.png'
										}
										className='me-2'
									/>
								);
							})}
						</div>
					</div>
					<div className='text-white center flex-column mt-5 fs-18'>
						{Object.keys(post?.values).map((key, index) => {
							return (
								<div className='mb-4'>
									<span className='me-2'>{key} :</span>
									<span>{post?.values[key]}</span>
								</div>
							);
						})}
					</div>
					<div className='center center mt-5 mb-4  fs-19 text-white'>
						<p className='fs-30'>{post?.price}</p>
					</div>
				</div>
			</main>
			<footer className='center mt-6'>
				{account || owner ?
					<>
						{
							post?.onSale ?
								<div className='header-Connect-btn h-40px center w-100px px-2 bold  cursor' onClick={() => revokeSellFunction()}>
									Revoke Sale
								</div>
								:
								''
						}
					</>
					:
					<>
						<div className='header-Connect-btn h-40px center w-100px px-2 bold  cursor' onClick={() => connectFunction()}>
							Connect
						</div>
					</>
				}
			</footer>
		</div>
	);
};

export default PostCard;
