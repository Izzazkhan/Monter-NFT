import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { apiUrl } from '../../utils/constant';
const PostCard = ({ className, post, stepImg, handleSelect }) => {
	// console.log('energyCalculate ===', post.values.Energy)


	const [minutes, setMinutes] = useState()
	const [seconds, setSeconds] = useState()
	const [hours, setHours] = useState()


	const apiCall = (energy, timeType) => {

		const localEnergy = post.values.Energy === '' ? 0 : post.values.Energy
		let energyCalculate = Number(localEnergy) + energy

		let params = new URLSearchParams()
		params.append('values.Energy', energyCalculate)
		// if (timeType === 'update') {
		params.append('values.UpdateTime', new Date())
		// }
		const config = {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}
		axios.post(`${apiUrl}/api/mintedMonster/setEnergyTime/${post.mintedId}`, params, config)
			.then((response) => {
				console.log('api response::', response)
			})
			.catch((error) => {
				console.log(error)
			})
	}

	function displayTimer() {
		console.log('function called')
		// const startTime = new Date(post.values.UpdateTime)
		// const startTime = new Date(5680000)
		// const endTime = new Date()
		// let timeDiff = endTime - startTime
		// timeDiff /= 1000
		// const seconds = Math.round(timeDiff % 60)
		// setSeconds(seconds)
		// timeDiff = Math.floor(timeDiff / 60)
		// const minutes = Math.round(timeDiff % 60)
		// setMinutes(minutes)
		// timeDiff = Math.floor(timeDiff / 60)
		// const hours = Math.round(timeDiff % 24)
		// setHours(hours)
		// console.log('days:::', hours, minutes, seconds, new Date())



		if (post.values.UpdateTime) {
			// Time in minutes
			const calculateUpdateTime = new Date(Math.abs(new Date(post.values.UpdateTime) - new Date())).getMinutes() - 1
			// console.log('calculateUpdateTime:', calculateUpdateTime)

			if (calculateUpdateTime >= 180) {
				apiCall(2, 'update')
			}
			else if (calculateUpdateTime >= 90) {
				apiCall(1, 'update')
			}
		}
		else {
			const calculateCreateTime = new Date(Math.abs(new Date(post.createdAt) - new Date())).getMinutes() - 1
			// console.log('calculateCreateTime:', calculateCreateTime)

			if (calculateCreateTime >= 180) {
				apiCall(2, 'create')
			}
			else if (calculateCreateTime >= 90) {
				apiCall(1, 'create')
			}
		}
	}


	useEffect(() => {
		if (Number(post.values.Energy) < 2) {
			let remainingTime
			if (post.values.UpdateTime) {
				const calculateUpdateTime = new Date(Math.abs(new Date(post.values.UpdateTime) - new Date())).getMinutes() - 1
				remainingTime = 90 - calculateUpdateTime
			}
			else {
				const calculateCreateTime = new Date(Math.abs(new Date(post.createdAt) - new Date())).getMinutes() - 1
				remainingTime = 90 - calculateCreateTime
			}
			let interval
			interval = setInterval(displayTimer, 1000 * 60 * remainingTime)
			return () => {
				clearInterval(interval)
			}
		}
	}, [])

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
					<p className='text-center mt-32px fs-18 bold'>{post?.title}</p>
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
							if (key == 'level' || key == 'element' || key == 'offchain_Exp') {
								return (
									<div className='mb-4'>
										<span className='me-2'>{key} :</span>
										<span>{post?.values[key]}</span>
									</div>
								);
							}
						})}
					</div>
					{/* <div className='timerBoard w-170px   ms-9 center py-3 bold'>{`${hours}h:${minutes}m:${seconds}s`}</div> */}
					<div className='center center mt-5 mb-4  fs-19 text-white'>
						<img src='/assets/imgs/coin.png' className='w-45px me-4' />
						<p className='fs-30'>{post?.price}</p>
					</div>
				</div>
			</main>
			<footer className='center mt-6'>
				<div className='header-Connect-btn h-40px center w-100px px-2 bold cursor'
					onClick={() => {
						handleSelect()
					}}>Select </div>
			</footer>
		</div>
	)
}

export default PostCard;
