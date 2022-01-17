import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { connectUserSuccess } from '../../store/actions/auth/login';
import axios from 'axios'
import Swal from 'sweetalert2';

const PostCard = ({ className, getData, post, stepImg, account }) => {


	const [owner, setOwner] = useState(null);
	const [sellInput, setSellInput] = useState(false);
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
		if (sellPrice > 0) {

			let params = new URLSearchParams()
			params.append('seller', account ? account : owner ? owner : userId)
			params.append('mintedMonsterId', post.mintedId)
			params.append('price', sellPrice)
			const config = {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}
			axios.post('http://localhost:4000/api/tradeItem', params, config)
				.then((res) => {
					console.log(res.data)
					Swal.fire({
						icon: 'success',
						title: 'Item Added To Sell',
						text: 'Please check Inventory Trading for items on trade!'
					})
				})
				.catch((e) => {
					console.log("Error ----------------")
					console.log(e)
				})
		} else {
			Swal.fire({
				icon: 'error',
				title: 'Invalid Price',
				text: 'Price should be greater than 0'
			})
		}
	}

	const revokeSellFunction = () => {
		axios.delete(`http://localhost:4000/api/tradeItem/${post.tradeId}`)
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
			});
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
					post?.onSale ? (
						<div className='header-Connect-btn h-40px center w-100px px-2 bold  cursor' onClick={() => revokeSellFunction()}>
							Revoke Sale
						</div>
					) : (

						!sellInput ?

							(
								<div className='header-Connect-btn h-40px center w-100px px-2 bold  cursor' onClick={() => setSellInput(true)}>
									Sell
								</div>
							)
							:
							''
					)
					:
					(
						<div className='header-Connect-btn h-40px center w-100px px-2 bold  cursor' onClick={() => connectFunction()}>
							Connect
						</div>
					)}


				{
					sellInput ?
						<>
							(
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

							<div className='header-Connect-btn h-40px center w-100px px-2 bold  cursor' onClick={() => sellFunction()}>
								Sell
							</div>
							<div className='header-Connect-btn h-40px center w-100px px-2 bold  cursor' onClick={() => setSellInput(false)}>
								Cancel
							</div>
							)
						</>
						:
						''
				}
			</footer>
		</div>
	);
};

export default PostCard;
