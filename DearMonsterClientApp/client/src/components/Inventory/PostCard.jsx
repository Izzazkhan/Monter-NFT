import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { connectUserSuccess, startLoading, stopLoading } from '../../store/actions/auth/login';
import Web3 from 'web3';
import axios from 'axios'
import Swal from 'sweetalert2';

import { apiUrl, appEnv, addressList } from '../../utils/constant'

import DearMonsterTrading from '../../contracts/DearMonsterTrading.json';
import DearMonsterTradingTest from '../../contracts/DearMonsterTradingTest.json';

import DearMonster from '../../contracts/DearMonster.json';
import DearMonsterTest from '../../contracts/DearMonsterTest.json';

const nftContractAbi = appEnv === 'test' ? DearMonsterTest : DearMonster
const tradingContractAbi = appEnv === 'test' ? DearMonsterTradingTest : DearMonsterTrading

const nftContractAddress = appEnv === 'test' ? addressList.nftAddressTest : addressList.nftAddress
const tradingContractAddress = appEnv === 'test' ? addressList.tradingAddressTest : addressList.tradingAddress


const PostCard = ({ className, getData, post, stepImg, account }) => {

	const [owner, setOwner] = useState(null);
	const [sellPrice, setSellPrice] = useState(0);
	const { userId } = useSelector(state => state.auth)
	const dispatch = useDispatch();


	const priceChangeHandler = (e) => {
		setSellPrice(e.target.value)
	}


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

	const sellFunction = async () => {

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
		const accounts = await web3.eth.getAccounts()

		if (sellPrice > 0) {
			const TradingContract = new web3.eth.Contract(tradingContractAbi.abi, tradingContractAddress)
			let DearMonsterContract = new web3.eth.Contract(nftContractAbi.abi, nftContractAddress)
			// await DearMonsterContract.methods.setApprovalForAll(TradingContract._address, true).send({ from: accounts[0] });



			try {
				await DearMonsterContract.methods.approve(TradingContract._address, post.id).send({ from: accounts[0] });
				const transaction = await TradingContract.methods.putTrade(post.id, sellPrice).send({ from: accounts[0] })

				if (transaction.status) {
					let params = new URLSearchParams()
					params.append('seller', account ? account : owner ? owner : userId)
					params.append('mintedMonsterId', post.mintedId)
					params.append('price', sellPrice)
					const config = {
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					}
					axios.post(`${apiUrl}/api/tradeItem`, params, config)
						.then((res) => {
							getData(userId)
							dispatch(stopLoading(false))
							Swal.fire({
								icon: 'success',
								title: 'Item Added To Sell',
								text: 'Please check Inventory Trading for items on trade!'
							})
						})
						.catch((e) => {
							console.log(e)
							dispatch(stopLoading(false))
							Swal.fire({
								icon: 'error',
								title: 'Error',
								text: 'Oops, Something went wrong'
							})
						})
				} else {
					dispatch(stopLoading(false))
					Swal.fire({
						icon: 'error',
						title: 'Transaction',
						text: 'Something went wrong, Please contact admin'
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
		else {
			dispatch(stopLoading(false))
			Swal.fire({
				icon: 'error',
				title: 'Invalid Price',
				text: 'Price should be greater than 0'
			})
		}
	}

	const revokeSellFunction = async () => {
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
		const accounts = await web3.eth.getAccounts()


		const TradingContract = new web3.eth.Contract(tradingContractAbi.abi, tradingContractAddress)
		let DearMonsterContract = new web3.eth.Contract(nftContractAbi.abi, nftContractAddress)

		// await DearMonsterContract.methods.setApprovalForAll(TradingContract._address, true).send({ from: accounts[0] });
		await DearMonsterContract.methods.approve(TradingContract._address, post.id).send({ from: accounts[0] });

		const transaction = await TradingContract.methods.removeTrade(post.id).send({ from: accounts[0] })

		if (transaction.status) {
			axios.delete(`${apiUrl}/api/tradeItem/${post.tradeId}`)
				.then((res) => {
					console.log('response delete', res)
					Swal.fire({
						icon: 'success',
						title: 'Item Removed From Trading',
						text: 'Please check Inventory Trading for items on trade!'
					})
				})
				.catch((e) => {
					console.log("error: ", e);
				})
		}
		else {
			Swal.fire({
				icon: 'error',
				title: 'Transaction',
				text: 'Transaction error'
			})
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
									<img key={i}
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
								<div className='mb-4' key={index}>
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
					(
						post?.onSale ? (
							<div className='header-Connect-btn h-40px center w-100px px-2 bold  cursor' onClick={() => revokeSellFunction()}>
								Revoke Sale
							</div>
						)
							:
							<>
								(
								<div
									className='header-Connect-btn py-3 px-4 mt-6 w-140px center bold fs-13 cursor'
									data-bs-toggle='modal'
									data-bs-target={`#SellMonster${post?.id}`}
								>
									Sell
								</div>
								<div className='modal fade' id={`SellMonster${post?.id}`} tabIndex='-1' aria-labelledby='SellMonsterLabel' aria-hidden='true' >
									<div className='modal-dialog'>
										<div className='modal-content py-3 bg-dark bg-opacity-75 text-white shadow-lg'>
											<div className='modal-body p-4'>
												<p className='mb-4'>Please enter amount for which you want to sell monster</p>
												<div className='d-flex justify-content-between w-60 mb-4'>
													<div className='d-flex align-items-center'>
														<input
															type='text'
															name='sellPrice'
															className='form-control  w-100px'
															id='sellPrice'
															value={sellPrice}
															onChange={priceChangeHandler}
														/>
													</div>
												</div>

											</div>
											<div className='modal-footer'>
												<div className='header-Connect-btn h-40px center w-100px px-2 bold  cursor' data-bs-dismiss='modal' onClick={() => sellFunction()}>
													Sell
												</div>
												<button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>
													Cancel
												</button>
											</div>
										</div>
									</div>
								</div>

								)
							</>

					)

					:
					(
						<div className='header-Connect-btn h-40px center w-100px px-2 bold  cursor' onClick={() => connectFunction()}>
							Connect
						</div>
					)}
			</footer>
		</div>
	);
};

export default PostCard;
