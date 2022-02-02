import React, { useEffect, useState, useMemo } from 'react';
import CurrenPageTitle from '../../components/common/CurrenPageTitle';
import ChooseDearMonster from '../../components/TrainingGround/ChooseDearMonster';
import ChooseMinion from '../../components/TrainingGround/ChooseMinion';
import axios from 'axios'
import { apiUrl } from '../../utils/constant';
import Swal from 'sweetalert2';
import Web3 from 'web3';
import { useSelector, useDispatch } from 'react-redux';
import { connectUserSuccess } from './../../store/actions/auth/login';
import moment from 'moment'
const isCommingSoon = true
const config = {
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Authorization': `xx Umaaah haaalaaa ${process.env.REACT_APP_APP_SECRET} haaalaaa Umaaah xx`
	}
}

const TrainingGround = () => {

	const dispatch = useDispatch();

	const [time, setTime] = React.useState('0d 0h 0m 0s')
	const [loading, setLoading] = React.useState(false)
	const [status, setStatus] = React.useState('')
	const [selectedMonster, setSelectedMonster] = React.useState({})
	const { userId } = useSelector((state) => state.auth)
	const [account, setAccount] = useState()
	const [earnerData, setEarnerData] = useState({})
	const [totalReward, setTotalReward] = useState('')
	const [updateMonsterAfterFight, setUpdateMonsterAfterFight] = useState(false)
	const [resolvedRewardRequest, setResolvedRewardRequest] = useState({})
	const [nonResolvedRewardRequest, setNonResolvedRewardRequest] = useState({})
	const [expGain, setExpGain] = useState('')

	useEffect(async () => {
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
		// Load account
		let accounts = await web3.eth.getAccounts()
		setAccount(accounts[0])

		if (userId) {
			function getAmount() {
				axios.get(`${apiUrl}/api/userEarning/${accounts[0]}`)
					.then((response) => {
						if (response.data.earnerData) {
							setEarnerData(response.data.earnerData)
						}
					})
					.catch((error) => {
						console.log(error)
					})
			}
			getAmount()
			function getWithdrawRequest() {
				axios.get(`${apiUrl}/api/withdrawRequest/userResolvedWithdrawRequest/${accounts[0]}`)
					.then((response) => {
						if (response.data.withdrawRequest) {
							setResolvedRewardRequest(response.data.withdrawRequest)
						}
					})
					.catch((error) => {
						console.log(error)
					})
			}
			getWithdrawRequest()

			function getOpenWithdrawRequest() {
				axios.get(`${apiUrl}/api/withdrawRequest/pending/${accounts[0]}`)
					.then((response) => {
						if (response.data.openWithdrawRequest) {
							setNonResolvedRewardRequest(response.data.openWithdrawRequest)
						}
					})
					.catch((error) => {
						console.log(error)
					})
			}
			getOpenWithdrawRequest()
		}

	}, [window.web3, userId, totalReward])


	const timer = () => {
		if (Object.keys(resolvedRewardRequest).length !== 0) {
			const countDownDate = Object.keys(resolvedRewardRequest).length > 0 && resolvedRewardRequest.updatedAt && new Date(resolvedRewardRequest.updatedAt).getTime()

			let countDownDateConverted = countDownDate / 1000
			countDownDateConverted = countDownDateConverted + 86400 * 7

			let now = new Date().getTime()

			countDownDateConverted = countDownDateConverted * 1000
			let distance = countDownDateConverted - now
			const calculateDays = Math.floor(distance / (1000 * 60 * 60 * 24))

			if (countDownDateConverted > now && calculateDays >= 0) {
				let days = Math.abs(Math.floor(distance / (1000 * 60 * 60 * 24)))
				let hours = Math.abs(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
				let minutes = Math.abs(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)))
				let seconds = Math.abs(Math.floor((distance % (1000 * 60)) / 1000))
				// if (minutes <= 0) {
				// 	setTime(`${seconds}s`)
				// } else if (hours <= 0) {
				// 	setTime(`${minutes}m ${seconds}s`)
				// } else if (days <= 0) {
				// 	setTime(`${hours}h ${minutes}m ${seconds}s`)
				// } else {
				setTime(`${days}d ${hours}h ${minutes}m ${seconds}s`)
				// }
			}
			else {
				setTime('7 days have passed')
			}
		}
	}

	useEffect(() => {
		// timer();
		let interval
		interval = setInterval(timer, 1000)
		return () => {
			clearInterval(interval)
		}
	}, [resolvedRewardRequest]);

	const handleonSelect = (monster) => {
		setSelectedMonster(monster)
	}

	// console.log('timeeeeeee', time)

	const energyExperienceUpdate = (params, type, EXP) => {
		axios.post(`${apiUrl}/api/mintedMonster/setEnergyTime/${selectedMonster.mintedId}`, params, config)
			.then((response) => {
				console.log('energy experienc update', response)
				if (type === 'EXP') {
					setExpGain(EXP)
				}
				setUpdateMonsterAfterFight(!updateMonsterAfterFight)
				setSelectedMonster({})
			})
			.catch((error) => {
				console.log(error)
			})
	}

	const rewardUpdateCall = (amount) => {

		let additionalReward
		axios
			.get(`${apiUrl}/api/levelBonus`)
			.then((res) => {
				additionalReward = res.data.levelBonus[0][`${selectedMonster.values.Level}`]
				additionalReward = additionalReward / 100
				let updateAmount

				if (earnerData && Object.keys(earnerData).length > 0) {
					updateAmount = earnerData.totalAmount + amount + additionalReward
				}
				else {
					updateAmount = amount + additionalReward
				}

				const updateParams = new URLSearchParams()
				updateParams.append('earnerAddress', account)
				updateParams.append('totalAmount', parseInt(updateAmount))

				axios.put(`${apiUrl}/api/userEarning/${account}`, updateParams, config)
					.then((response) => {
						console.log('add or update earning ::', response)
						if (response.data.userEarning) {
							setTotalReward(response.data.userEarning.totalAmount)
						}
					})
					.catch((error) => {
						console.log(error)
					})

			})
			.catch((e) => {
				console.log("error: ", e);
			})
	}

	const minionFight = (minion) => {
		console.log('minoinnn', minion)
		if (Object.keys(selectedMonster).length === 0) {
			setLoading(false)
			setStatus('Please select DearMonster first.')
			setExpGain('')
			setTotalReward('')
		}
		else {
			if (selectedMonster.values.Energy >= 1) {
				setLoading(true);
				const random = Math.floor(Math.random() * 100) + 1
				let status = '';
				if (random <= minion.values.Win_Rate) {
					status = 'You have won the fight.';
					setLoading(false);
					setStatus(status);
					let experienceCalculate = Number(selectedMonster.values.EXP) + minion.values.Exp_Gain

					let localLevel = '1'

					if (Number(experienceCalculate) < 450) {
						localLevel = '1'
					}
					if (Number(experienceCalculate) >= 450 && Number(experienceCalculate) < 1200) {
						localLevel = '2'
					}
					else if (Number(experienceCalculate) >= 1200 && Number(experienceCalculate) < 3000) {
						localLevel = '3'
					}
					else if (Number(experienceCalculate) >= 3000 && Number(experienceCalculate) < 8000) {
						localLevel = '4'
					}
					else if (Number(experienceCalculate) >= 8000 && Number(experienceCalculate) < 15000) {
						localLevel = '5'
					}
					else if (Number(experienceCalculate) >= 15000) {
						localLevel = '6'
					}

					let params = new URLSearchParams()
					params.append('values.EXP', experienceCalculate)
					params.append('values.Level', localLevel)

					energyExperienceUpdate(params, 'EXP', minion.values.Exp_Gain)
					let amount = 0
					Object.entries(JSON.parse(minion.values.Reward_Estimated)).map((item, i) => {
						const field = item[0]
						const value = item[1]
						if (Number(field) === Number(selectedMonster.rating)) {
							amount = Number(value)
						}
					})
					rewardUpdateCall(amount)

				} else {
					status = 'You have lost the fight.';
					setLoading(false)
					setStatus(status)
					let experienceCalculate = Number(selectedMonster.values.EXP) + minion.values.Lose_Exp_Gain

					let localLevel = '1'

					if (Number(experienceCalculate) < 450) {
						localLevel = '1'
					}
					if (Number(experienceCalculate) >= 450 && Number(experienceCalculate) < 1200) {
						localLevel = '2'
					}
					else if (Number(experienceCalculate) >= 1200 && Number(experienceCalculate) < 3000) {
						localLevel = '3'
					}
					else if (Number(experienceCalculate) >= 3000 && Number(experienceCalculate) < 8000) {
						localLevel = '4'
					}
					else if (Number(experienceCalculate) >= 8000 && Number(experienceCalculate) < 15000) {
						localLevel = '5'
					}
					else if (Number(experienceCalculate) >= 15000) {
						localLevel = '6'
					}

					let params = new URLSearchParams()
					params.append('values.EXP', experienceCalculate)
					params.append('values.Level', localLevel)

					energyExperienceUpdate(params, 'EXP', minion.values.Lose_Exp_Gain)
				}
				const energyCalculate = selectedMonster.values.Energy - 1
				let params = new URLSearchParams()
				params.append('values.Energy', energyCalculate)
				energyExperienceUpdate(params, 'energy', '')
				if (Number(selectedMonster.values.Energy) === 2) {
					let params = new URLSearchParams()
					params.append('values.UpdateTime', new Date())
					axios.post(`${apiUrl}/api/mintedMonster/setEnergyTime/${selectedMonster.mintedId}`, params, config)
						.then((response) => {
							console.log('update time at fight', response)
						})
						.catch((error) => {
							console.log(error)
						})
				}
			} else {
				setLoading(false)
				setStatus('')
				Swal.fire({
					icon: 'error',
					title: 'Energy',
					text: 'Dear Monster Energy should be greater than 0'
				})
			}
		}
	}


	const handleConnect = async () => {

		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum)
			await window.ethereum.enable();
		} else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider)
			window.loaded_web3 = true
		} else {
			window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
		}

		await window.ethereum.request({
			method: "wallet_requestPermissions",
			params: [{
				eth_accounts: {}
			}]
		});
		let web3 = window.web3
		// Load account
		let accounts = await web3.eth.getAccounts()
		setAccount(accounts[0]);

		dispatch(connectUserSuccess(accounts[0]))

	}

	const claimRewardHandler = async () => {

		try {
			const getWithdrawRequest = await axios.get(`${apiUrl}/api/withdrawRequest/userWithdrawRequest/${account}`)
			if (getWithdrawRequest?.data?.withdrawRequest?.length > 0) {
				if (Object.keys(nonResolvedRewardRequest).length > 0) {
					Swal.fire({
						icon: 'error',
						title: 'You have a pending claim.',
						text: 'Please note that you can only claim reward once every 7 days.'
					})
					return
				} else {
					if (Object.keys(resolvedRewardRequest).length > 0) {
						const lastTime = resolvedRewardRequest.updatedAt && new Date(resolvedRewardRequest.updatedAt).getTime()
						let now = new Date().getTime()
						let distance = lastTime - now
						let diffInDays = Math.abs((distance / (1000 * 60 * 60 * 24)))

						if (diffInDays >= 7) {
							try {
								if (parseInt(earnerData.totalAmount) > 0) {
									const rewardParam = new URLSearchParams()
									rewardParam.append('requesterAddress', account)
									rewardParam.append('amount', earnerData.totalAmount)
									const postWithdraw = await axios.post(`${apiUrl}/api/withdrawRequest`, rewardParam, config)
									setEarnerData({})
									if (postWithdraw) {
										Swal.fire({
											icon: 'success',
											title: 'Reward Claim Requested',
											text: 'Reward request has been created'
										})
									}
								} else {
									Swal.fire({
										icon: 'error',
										title: 'Reward Claim Failed',
										text: 'You dont have any reward to claim, Please earn some DMS'
									})
								}
							} catch (error) {
								Swal.fire({
									icon: 'error',
									title: 'Error',
									text: 'Oops, Something went wrong, Please contact admin'
								})
							}
						} else {
							Swal.fire({
								icon: 'error',
								title: 'Reward Claim',
								text: 'Please note that you can only claim reward once every 7 days.'
							})
						}
					}
				}
			} else {
				try {
					if (parseInt(earnerData.totalAmount) > 0) {
						const rewardParam = new URLSearchParams()
						rewardParam.append('requesterAddress', account)
						rewardParam.append('amount', earnerData.totalAmount)
						const postWithdraw = await axios.post(`${apiUrl}/api/withdrawRequest`, rewardParam, config)
						setEarnerData({})
						if (postWithdraw) {
							Swal.fire({
								icon: 'success',
								title: 'Reward Claim Requested',
								text: 'Reward request has been created'
							})
						}
					} else {
						Swal.fire({
							icon: 'error',
							title: 'Reward Claim Failed',
							text: 'You dont have any reward to claim, Please earn some DMS'
						})
					}

				} catch (error) {
					Swal.fire({
						icon: 'error',
						title: 'Reward Claim Failed',
						text: 'Reward request claim failed, please try again'
					})
				}
			}
		} catch (error) {
			console.log(error)
		}
	}

	const dearMonster = useMemo(() => {
		return <ChooseDearMonster handleonSelect={handleonSelect} selectedMonster={selectedMonster}
			updateMonsterAfterFight={updateMonsterAfterFight} />
	}, [updateMonsterAfterFight, selectedMonster])


	const minion = useMemo(() => {
		return <ChooseMinion minionFight={minionFight} loading={loading} status={status} totalReward={totalReward} selectedMonster={selectedMonster}
			expGain={expGain}
		/>
	}, [status, loading, minionFight, totalReward, selectedMonster, expGain])

	return (
		<div>
			<CurrenPageTitle title='Training Ground'></CurrenPageTitle>
			{
				userId ?
					<>
						<div className='container center mt-8'>
							<div className='center flex-column'>
								<div className='border border-warning text-white p-2 rounded-2'>
									Total Rewards: {earnerData && Object.keys(earnerData).length > 0 ? parseInt(earnerData.totalAmount) : 0}
									<img src='/assets/imgs/coin.png' className='img-fluid' alt='coin' />
								</div>
								<section className='mt-5'>
									<div className='header-Connect-btn py-3 w-190px center bold fs-13 cursor'
										data-bs-toggle='modal'
										data-bs-target='#ClaimRewardHistory'>
										Claim Reward History
									</div>
									<div
										className='modal fade'
										id='ClaimRewardHistory'
										tabIndex='-1'
										aria-labelledby='ClaimRewardHistoryLabel'
										aria-hidden='true'
									>
										<div className='modal-dialog'>
											<div className='modal-content py-3 bg-dark bg-opacity-75 text-white shadow-lg'>
												<div className='modal-body p-4'>
													{/* Popup to show last 10 claims amount in DMS, datetime, status, tx id */}
													Coming Soon
												</div>
												<div className='modal-footer'>
													<button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>
														Close
													</button>
													{/* <button type='button' className='btn btn-warning' data-bs-dismiss='modal'>
													Confirm
												</button> */}
												</div>
											</div>
										</div>
									</div>
								</section>
								<section className='mt-5 d-flex align-items-center '>
									<div className='header-Connect-btn py-3 px-4 w-140px center bold fs-13 cursor'
										data-bs-toggle='modal'
										data-bs-target='#ClaimReward' onClick={claimRewardHandler}>
										Claim Reward
									</div>
									<div className='timerBoard w-170px   ms-5 center py-3 bold'>{time}</div>
								</section>

								<div
									className='header-Connect-btn py-3 px-4 mt-6 w-140px center bold fs-13 cursor'
									data-bs-toggle='modal'
									data-bs-target='#EarlyClaimModal'
								>
									Early claim
								</div>
								<div
									className='modal fade'
									id='EarlyClaimModal'
									tabIndex='-1'
									aria-labelledby='EarlyClaimModalLabel'
									aria-hidden='true'
								>
									<div className='modal-dialog'>
										<div className='modal-content py-3 bg-dark bg-opacity-75 text-white shadow-lg'>
											<div className='modal-body p-4'>
												{/* 30% tax -Allows the user to claim rewards with a 30% penalty. Ie for 100
											rewards, 70DMS is transferred from admin wallet to user wallet. */}
												Coming Soon
											</div>
											<div className='modal-footer'>
												<button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>
													Close
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						{dearMonster}
						{minion}
					</>
					:
					<div className='container'>
						<div className='center'>
							<div>
								<p className='text-white  mt-9 fs-23 bg-dark bg-opacity-50 p-3 rounded-3 w-auto'>
									Please connect to see Inventory
								</p>
								<div
									onClick={handleConnect}
									className={` header-Connect-btn h-40px w-sm mx-auto  mt-5 center bold cursor`}
								>
									Connect
								</div>
							</div>
						</div>
					</div>
			}
		</div>
	);
};

export default TrainingGround;