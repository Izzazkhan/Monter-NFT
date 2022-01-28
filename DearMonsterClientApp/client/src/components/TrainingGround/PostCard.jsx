import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { apiUrl } from '../../utils/constant';
const PostCard = ({ className, post, selectedMonster, handleSelect, updateMonsterAfterEnergyChange, setUpdateMonsterAfterEnergyChange }) => {
	// console.log('energyCalculate ===', post)


	const [minutes, setMinutes] = useState()
	const [seconds, setSeconds] = useState()
	const [hours, setHours] = useState()
	const [remainingTime, setRemainingTime] = useState(1)
	const [timeInMinute, setTimeInMinute] = useState(1)


	const apiCall = (energy, calculateTime) => {

		const localEnergy = post.values.Energy === '' ? 0 : post.values.Energy
		let energyCalculate = Number(localEnergy) + energy

		let params = new URLSearchParams()
		params.append('values.Energy', energyCalculate)
		// if (timeType === 'update') {
		params.append('values.UpdateTime', calculateTime)
		// }
		const config = {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}
		axios.post(`${apiUrl}/api/mintedMonster/setEnergyTime/${post.mintedId}`, params, config)
			.then((response) => {
				console.log('Energy update::', response)
				setUpdateMonsterAfterEnergyChange(!updateMonsterAfterEnergyChange)
			})
			.catch((error) => {
				console.log(error)
			})
	}

	function displayTimer(calculateTime) {
		// console.log('function called')
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

		if (post.values.UpdateTime !== 'undefined') {
			// Time in minutes
			let calculateUpdateTimeInMinutes = (new Date(post.values.UpdateTime)).getTime() - (new Date()).getTime()
			calculateUpdateTimeInMinutes = Math.abs(Math.round(calculateUpdateTimeInMinutes / 60000))

			// console.log('calculateUpdateTimeInMinutes:', calculateUpdateTimeInMinutes)

			if (calculateUpdateTimeInMinutes >= 180) {
				if (Number(post.values.Energy) === 0) {
					apiCall(2, calculateTime)
				} else {
					apiCall(1, calculateTime)
				}
			}
			else if (calculateUpdateTimeInMinutes >= 90) {
				apiCall(1, calculateTime)
			}
		}
		else {
			let calculateCreateTimeInMinutes = (new Date(post.createdAt)).getTime() - (new Date()).getTime()
			calculateCreateTimeInMinutes = Math.abs(Math.round(calculateCreateTimeInMinutes / 60000))

			// console.log('calculateCreateTimeInMinutes:', calculateCreateTimeInMinutes)
			if (calculateCreateTimeInMinutes >= 180) {
				if (Number(post.values.Energy) === 0) {
					apiCall(2, calculateTime)
				} else {
					apiCall(1, calculateTime)
				}
			}
			else if (calculateCreateTimeInMinutes >= 90) {
				apiCall(1, calculateTime)
			}
		}
	}


	const timer = () => {
		let calcRemainingTime = new Date()
		// console.log('calcRemainingTime::1', calcRemainingTime)

		let calculateTimeInMinutes
		if (post.values.UpdateTime !== 'undefined') {
			calculateTimeInMinutes = (new Date(post.values.UpdateTime)).getTime() - (new Date()).getTime()
		}
		else {
			calculateTimeInMinutes = (new Date(post.createdAt)).getTime() - (new Date()).getTime()
		}

		calculateTimeInMinutes = Math.abs(Math.round(calculateTimeInMinutes / 60000))
		setTimeInMinute(calculateTimeInMinutes)

		if (calculateTimeInMinutes > 90 && calculateTimeInMinutes < 180) {
			const oneHalfHours = 1500 * 60 * 60
			const lastTime = post.values.UpdateTime !== 'undefined' ? new Date(post.values.UpdateTime) : new Date(post.createdAt)
			const calculateTime = new Date(lastTime.getTime() + oneHalfHours)
			calcRemainingTime = (new Date()).getTime() - calculateTime.getTime()
			calcRemainingTime = Math.abs(Math.round(calcRemainingTime / 60000))
			calcRemainingTime = 180 - calcRemainingTime
			setRemainingTime(calcRemainingTime)
		}

		else if (calculateTimeInMinutes < 90) {
			calcRemainingTime = calculateTimeInMinutes
			// console.log('displayTimer3', calcRemainingTime)
			calcRemainingTime = 90 - calcRemainingTime
			// console.log('displayTimer4', calcRemainingTime)
			setRemainingTime(calcRemainingTime)
		}
		// console.log('calcRemainingTime::', calcRemainingTime)
	}


	useEffect(() => {
		if (Number(post.values.Energy) < 2) {
			if (timeInMinute >= 180) {
				displayTimer(new Date())
			}
			else if (timeInMinute > 90) {
				const oneHalfHours = 1500 * 60 * 60
				const lastTime = post.values.UpdateTime !== 'undefined' ? new Date(post.values.UpdateTime) : new Date(post.createdAt)
				const calculateTime = new Date(lastTime.getTime() + oneHalfHours)
				displayTimer(calculateTime)
			}
			else if (timeInMinute === 90) {
				displayTimer(new Date())
			}
		}
	}, [updateMonsterAfterEnergyChange]) // timeInMinute

	useEffect(() => {
		if (Number(post.values.Energy) < 2) {
			let timeInterval
			timeInterval = setInterval(timer, 1000)
			let interval
			// console.log('remainingTimeremainingTime', remainingTime)
			interval = setInterval(displayTimer, 1000 * 60 * remainingTime, new Date())
			return () => {
				clearInterval(timeInterval)
				clearInterval(interval)
			}
		}
	}, [remainingTime])

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
							if (key == 'Level' || key == 'Energy' || key == 'OwnerID' || key == 'Price' || key == 'EXP') {
								return (
									<div className='mb-4' key={index}>
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
				{
					selectedMonster && Object.keys(selectedMonster).length > 0 ?
						selectedMonster.mintedId == post?.mintedId ?

							<div className='header-Connect-btn h-40px center w-100px px-2 bold'>
								Selected
							</div>
							:
							<div className='header-Connect-btn h-40px center w-100px px-2 bold cursor' onClick={() => { handleSelect() }}>
								Select
							</div>
						:
						<div className='header-Connect-btn h-40px center w-100px px-2 bold cursor' onClick={() => { handleSelect() }}>
							Select
						</div>
				}
			</footer>
		</div>
	)
}

export default PostCard;
