import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { connectUserSuccess } from '../../store/actions/auth/login';
import axios from 'axios'
import Web3 from 'web3';
import Swal from 'sweetalert2';
import { notification } from "../../utils/notification";

import { apiUrl, appEnv, addressList } from '../../utils/constant'

import DearMonsterTrading from '../../contracts/DearMonsterTrading.json';
import DearMonsterTradingTest from '../../contracts/DearMonsterTradingTest.json';

import DMSToken from '../../contracts/DMSToken.json';
import DMSTokenTest from '../../contracts/DMSTokenTest.json';

const tradingContractAbi = appEnv === 'test' ? DearMonsterTradingTest : DearMonsterTrading 
const tokenContractAbi = appEnv === 'test' ? DMSTokenTest : DMSToken 

const tradingContractAddress = appEnv === 'test' ? addressList.tradingAddressTest : addressList.tradingAddress 
const tokenContractAddress = appEnv === 'test' ? addressList.tokenAddressTest : addressList.tokenAddress 


const PostCard = ({ className, post, stepImg }) => {
	const { userId } = useSelector(state => state.auth)
	const dispatch = useDispatch();

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
	};

	const purchaseFun = async () => {
		if(userId || owner) {
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

			let DMSTokenContract = new web3.eth.Contract(tokenContractAbi.abi, tokenContractAddress)

			let balance = await DMSTokenContract.methods.balanceOf(accounts[0]).call()

			var convertedPrice = Number(parseInt(post.price) * 10 ** 18);
			let convertedPriceLocale = convertedPrice.toLocaleString('fullwide', { useGrouping: false })

			if (convertedPrice >= balance) {
				let notify = notification({
					type: 'error',
					message: 'Insufficient fund!',
				});
				notify();
				return
			}

			await DMSTokenContract.methods.approve(TradingContract._address, web3.utils.toBN(convertedPriceLocale)).send({ from: accounts[0] });

			// let DearMonsterContract = new web3.eth.Contract(DearMonster.abi, "0xf5ba121b8e4c89e4090feC0E262b8Af17Bedc776")
			// // await DearMonsterContract.methods.setApprovalForAll(TradingContract._address, true).send({ from: accounts[0] });
			// await DearMonsterContract.methods.approve(TradingContract._address, post.id).send({ from: accounts[0] });
			// const transaction = await TradingContract.methods.buyTrade(post.id,  web3.utils.toBN(post.price.toString())).send({ from: accounts[0] })

			const transaction = await TradingContract.methods.buyTrade(post.id,  web3.utils.toBN(convertedPriceLocale)).send({ from: accounts[0] })

			if (transaction.status) {
				let params = new URLSearchParams()
				params.append('owner', post.owner)
				params.append('seller', post.seller)
				params.append('buyer', userId ? userId : owner)
				params.append('tradeId', post.tradeId)
				params.append('mintedId', post.mintedId)

				const config = {
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}
				axios.post(`${apiUrl}/api/tradeItem/buyFromAllTradeItems`, params, config)
					.then((res) => {
						console.log(res.data)
						Swal.fire({
							icon: 'success',
							title: 'Purchase Done !',
							text: 'Please check inventory for new monster'
						})
					})
					.catch((e) => {
						console.log("Error ----------------")
						console.log(e)
					})
			}
		} else {
			Swal.fire({
				icon: 'error',
				title: 'Error !',
				text: 'Something went wrong, please reconnect wallet'
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
							if (
								key == 'Level' ||
								key == 'Element' ||
								key == 'EXP' ||
								key == 'OwnerID'
							) {
								return (
									<div className='mb-4'>
										<span className='me-2'>{key} :</span>
										<span>{post?.values[key]}</span>
									</div>
								);
							}
						})}
					</div>
					<div className='center center mt-5 mb-4  fs-19 text-white'>
						<img src='/assets/imgs/coin.png' className='w-45px me-4' />
						<p className='fs-30'>{post?.price}</p>
					</div>
				</div>
			</main>
			<footer className='center mt-6'>
				{userId ?
					userId != post?.seller ?
						(
							<div className='header-Connect-btn h-40px center w-100px px-2 bold  cursor'
								onClick={() => purchaseFun()}>
								Purchase
							</div>
						)
						:
						(
							<div className='header-Connect-btn h-40px center w-100px px-2 bold  cursor'>
								Owned
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

export default PostCard;
