import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { connectUserSuccess } from '../../store/actions/auth/login';
import axios from 'axios'

const PostCard = ({ className, post, stepImg }) => {
	const { userId } = useSelector(state => state.auth)
	const dispatch = useDispatch();

	const [owner, setOwner] = useState(null);

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

	const purchaseFun = () => {

		let params = new URLSearchParams()
		params.append('owner', post.owner)
		params.append('seller', post.seller)
		params.append('buyer', owner)
		params.append('tradeId', post.tradeId)
		params.append('mintedId', post.mintedId)
		

		const config = {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}
		axios.post('http://localhost:4000/api/tradeItem/buyFromAllTradeItems', params, config)
			.then((res) => {
				console.log(res.data)
			})
			.catch((e) => {
				console.log("Error ----------------")
				console.log(e)
			})

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
							onClick={ ()=> purchaseFun() }>
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
