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



	const energyUpdateCall = (energy, calculateTime) => {

		const localEnergy = post.values.Energy === '' ? 0 : post.values.Energy
		let energyCalculate = Number(localEnergy) + energy

		let params = new URLSearchParams()
		params.append('values.Energy', energyCalculate)
		params.append('values.UpdateTime', calculateTime)
		const config = {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Authorization': `xx Umaaah haaalaaa ${process.env.REACT_APP_APP_SECRET} haaalaaa Umaaah xx`
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

	function displayUpdatedTime(calculateTime) {

		let calculateTimeInMinutes
		if (post.values.UpdateTime !== 'undefined') {
			calculateTimeInMinutes = (new Date(post.values.UpdateTime)).getTime() - (new Date()).getTime()
		}
		else {
			calculateTimeInMinutes = (new Date(post.createdAt)).getTime() - (new Date()).getTime()
		}
		calculateTimeInMinutes = Math.abs(Math.round(calculateTimeInMinutes / 60000))
		// console.log('calculateTimeInMinutes before API call', calculateTime, calculateTimeInMinutes)

		if (calculateTimeInMinutes >= 180) {
			if (Number(post.values.Energy) === 0) {
				energyUpdateCall(2, calculateTime)
			} else {
				energyUpdateCall(1, calculateTime)
			}
		}
		else if (calculateTimeInMinutes >= 90) {
			energyUpdateCall(1, calculateTime)
		}
	}


	const displayTimer = () => {
		let calcRemainingTime = new Date()

		let calculateTimeInMinutes
		if (post.values.UpdateTime !== 'undefined') {
			calculateTimeInMinutes = (new Date(post.values.UpdateTime)).getTime() - (new Date()).getTime()
		}
		else {
			calculateTimeInMinutes = (new Date(post.createdAt)).getTime() - (new Date()).getTime()
		}

		calculateTimeInMinutes = Math.abs(Math.round(calculateTimeInMinutes / 60000))
		setTimeInMinute(calculateTimeInMinutes)
		// console.log('calculateTimeInMinutes::', calculateTimeInMinutes)

		if (calculateTimeInMinutes > 90) {
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
			calcRemainingTime = 90 - calcRemainingTime
			setRemainingTime(calcRemainingTime)
		}
		// console.log('timeInMinute::', timeInMinute)
	}


	useEffect(() => {
		if (Number(post.values.Energy) < 2) {
			if (timeInMinute >= 180) {
				displayUpdatedTime(new Date())
			}
			else if (timeInMinute > 90) {
				const oneHalfHours = 1500 * 60 * 60
				const lastTime = post.values.UpdateTime !== 'undefined' ? new Date(post.values.UpdateTime) : new Date(post.createdAt)
				const calculateTime = new Date(lastTime.getTime() + oneHalfHours)
				displayUpdatedTime(calculateTime)
			}
			else if (timeInMinute === 90) {
				displayUpdatedTime(new Date())
			}
		}
	}, [post, timeInMinute]) // timeInMinute

	useEffect(() => {
		if (Number(post.values.Energy) < 2) {
			let timeInterval
			timeInterval = setInterval(displayTimer, 1000)
			let interval
			// console.log('remainingTimeremainingTime', remainingTime)
			interval = setInterval(displayUpdatedTime, 1000 * 60 * remainingTime, new Date())
			return () => {
				clearInterval(timeInterval)
				clearInterval(interval)
			}
		}
	}, [remainingTime, post])

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
							if (key == 'Level' || key == 'Energy' || key == 'OwnerID' || key == 'EXP') {
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
