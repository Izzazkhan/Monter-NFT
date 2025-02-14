import React, { useEffect, useState, useMemo } from 'react';
import CurrenPageTitle from '../../components/common/CurrenPageTitle';
import ChooseDearMonsterScholar from '../../components/TrainingGround/ChooseDearMonsterScholar';
import ChooseMinion from '../../components/TrainingGround/ChooseMinion';
import axios from 'axios'
import { apiUrl } from '../../utils/constant';
import Swal from 'sweetalert2';
import Web3 from 'web3';
import { useSelector, useDispatch } from 'react-redux';
import { connectUserSuccess } from './../../store/actions/auth/login';
import NavLinks from '../../components/TrainingGround/NavLinks';
import ClipLoader from "react-spinners/ClipLoader";

const config = {
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Authorization': `xx Umaaah haaalaaa ${process.env.REACT_APP_APP_SECRET} haaalaaa Umaaah xx`
	}
}

const EnergyText = {
	text: (
		<span>
			The DearMonster has
			<br /> insufficient energy.
		</span>
	)
}


const loaderParentStyle = {
	display: "flex",
	top: "0",
	position: "fixed",
	alignItems: "center",
	justifyContent: "center",
	width: "100%",
	height: "100%",
	left: "0",
	background: "#686868e0",
	zIndex: "99999",
}
const loaderStyle = {
	alignItems: "center",
	justifyContent: "center",
	display: "flex",
	flexDirection: "column"
}
const textStyle = {
	fontSize: "25px",
	color: "orange",
	fontWeight: "bold"
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
	const [claimHistory, setClaimHistory] = useState([])
	const [type, setType] = useState(localStorage.getItem('type'))


	const match = {params : { slug: 'scholar' }}

	useEffect(() => {
		getConnection();
	}, [window.web3])

	const getConnection = async () => {
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
		// Load account
		let accounts = await web3.eth.getAccounts()
		setAccount(accounts[0]);

		setType('scholar')
		localStorage.setItem("type", 'scholar')
	};

	useEffect(() => {
		if (userId && type === 'scholar') {
			// api to get user earnings
			function getAmount() {
				axios.get(`${apiUrl}/api/userEarning/${userId}/scholar`)
					.then((response) => {
						if (response?.data?.earnerData) {
							setEarnerData(response.data.earnerData)
						}
						else {
							setEarnerData({})
						}
						
					})
					.catch((error) => {
						console.log(error)
					})
			}
			getAmount()

			// resolved withdraw request, to show remaining time for next claim
			function getWithdrawRequest() {
				axios.get(`${apiUrl}/api/withdrawRequest/userResolvedWithdrawRequest/${userId}/scholar`)
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

			// user's withdraw pending request
			function getOpenWithdrawRequest() {
				axios.get(`${apiUrl}/api/withdrawRequest/pending/${userId}/scholar`)
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

			// user's claim history
			function getClaimHistory() {
				axios.get(`${apiUrl}/api/withdrawRequest/claimHistory/${userId}/scholar`)
					.then((response) => {
						if (response.data.withdrawRequestApproved) {
							setClaimHistory(response.data.withdrawRequestApproved)
						}
					})
					.catch((error) => {
						console.log(error)
					})
			}
			getClaimHistory()
		}
	}, [userId, totalReward, type])


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
		let interval
		interval = setInterval(timer, 1000)
		return () => {
			clearInterval(interval)
		}
	}, [resolvedRewardRequest]);

	const handleonSelect = (monster) => {
		setSelectedMonster(monster)
	}

	const energyExperienceUpdate = (params, EXP, status) => {
		axios.post(`${apiUrl}/api/mintedMonster/setEnergyTime/${selectedMonster.mintedId}`, params, config)
			.then((response) => {
				setExpGain(EXP)
				setStatus(status)
				setLoading(false)
				setUpdateMonsterAfterFight(!updateMonsterAfterFight)
				setSelectedMonster({})
			})
			.catch((error) => {
				console.log(error)
			})
	}

	const rewardUpdateCall = (amount, fightStatus, minionId,  monsterId) => {

		let additionalReward
		axios
			.get(`${apiUrl}/api/levelBonus`)
			.then((res) => {
				additionalReward = res.data.levelBonus[0][`${selectedMonster.values.Level}`]
				additionalReward = ( additionalReward / 100 ) * amount

				let updateAmount
				let totalNewAmount = additionalReward + amount
				totalNewAmount = totalNewAmount - (totalNewAmount * (10/100))

				let managerShare = (totalNewAmount * selectedMonster.scholarshipsItems.profitShare.Manager_Share) / 100
				let scholarShare = totalNewAmount - managerShare
				const roundedManagerShare = Math.round(managerShare / 0.5) * 0.5
				const roundedScholarShare = Math.round(scholarShare / 0.5) * 0.5

				if (earnerData && Object.keys(earnerData).length > 0) {
					updateAmount = earnerData.totalAmount + roundedScholarShare
				}
				else {
					updateAmount = roundedScholarShare
				}
				
				axios.get(`${apiUrl}/api/userEarning/${selectedMonster.owner}/scholar`)
				.then((response) => {

					if (response?.data) {

						let prevTotal = response?.data?.earnerData?.totalAmount
						let grandTotal
						
						if(prevTotal) {
							grandTotal = prevTotal + roundedManagerShare
						} else {
							grandTotal = roundedManagerShare
						}
						
						const updateParams2 = new URLSearchParams()
						updateParams2.append('earnerAddress', selectedMonster.owner)
						updateParams2.append('totalAmount', grandTotal)

						axios.put(`${apiUrl}/api/userEarning/${selectedMonster.owner}/scholar`, updateParams2, config)
							.then((response) => {
								const updateParams = new URLSearchParams()
								updateParams.append('earnerAddress', userId)
								updateParams.append('totalAmount', updateAmount)
				
								axios.put(`${apiUrl}/api/userEarning/${userId}/scholar`, updateParams, config)
									.then((response) => {
										if (response.data.userEarning) {
											setTotalReward(amount + additionalReward)
											activityLog(fightStatus, minionId, monsterId, amount + additionalReward)
										}
									})
									.catch((error) => {
										console.log(error)
									})
				
								.catch((error) => {
									console.log(error)
								})


							})
							.catch((error) => {
								console.log(error)
							})
					}
				})
			})
			.catch((e) => {
				console.log("error: ", e);
			})
	}

	const fightLogCall = (fightStatus, minionId,  monsterId) => {
		const updateParams = new URLSearchParams()
		updateParams.append('type', 'scholar')
		updateParams.append('fightStatus', fightStatus)
		updateParams.append('minionId', minionId)
		updateParams.append('monsterId', monsterId)

		axios.post(`${apiUrl}/api/fightHistory`, updateParams, config)
			.then((response) => {
				console.log('fight log', response)
			})
			.catch((error) => {
				console.log(error)
			})
	}

	const activityLog = (fightStatus, minionId, monsterId, rewards) => {
		let newParams = new URLSearchParams()
		newParams.append('name', 'Monster fight with minion')
		newParams.append('type', 'dearMonsterFight')
		newParams.append('activityDetails.minionId', minionId)
		newParams.append('activityDetails.mintedMonsterId', monsterId)
		newParams.append('activityDetails.fightDetails.fightStatus', fightStatus)
		newParams.append('activityDetails.fightDetails.rewards', rewards)
		newParams.append('activityDetails.fightDetails.type', 'scholar')
		axios.post(`${apiUrl}/api/activity`, newParams, config)
			.then((res) => {
				console.log('Activity has been created')
			})
			.catch((e) => {
				console.log(e)
			})
	}

	const minionFight = (minion) => {
		if (Object.keys(selectedMonster).length === 0) {
			setLoading(false)
			setStatus('Please select DearMonster first.')
			setExpGain('')
			setTotalReward('')
		}
		else {
			setLoading(true)
			if (selectedMonster.values.Energy >= 1) {
				setLoading(true)
				setExpGain('')
				setTotalReward('')
				const random = Math.floor(Math.random() * 100) + 1
				let status = '';
				const energyCalculate = selectedMonster.values.Energy - 1
				if (random <= minion.values.Win_Rate) { // true
					status = 'You have won the fight.'

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
					params.append('values.Energy', energyCalculate)
					fightLogCall('win', minion._id, selectedMonster.monsterId)
					energyExperienceUpdate(params, minion.values.Exp_Gain, status)
					let amount = 0
					Object.entries(JSON.parse(minion.values.Reward_Estimated)).map((item, i) => {
						const field = item[0]
						const value = item[1]
						if (Number(field) === Number(selectedMonster.rating)) {
							amount = Number(value)
						}
					})

					rewardUpdateCall(amount, 'win', minion._id, selectedMonster.monsterId)

				} else {
					status = 'You have lost the fight.'
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
					params.append('values.Energy', energyCalculate)
					fightLogCall('lose', minion._id, selectedMonster.monsterId)
					activityLog('lose', minion._id, selectedMonster.monsterId, 0)
					energyExperienceUpdate(params, minion.values.Lose_Exp_Gain, status)
				}
				if (Number(selectedMonster.values.Energy) === 2) {
					let params = new URLSearchParams()
					params.append('values.UpdateTime', new Date())
					axios.post(`${apiUrl}/api/mintedMonster/setEnergyTime/${selectedMonster.mintedId}`, params, config)
						.then((response) => {
							console.log( response)
						})
						.catch((error) => {
							console.log(error)
						})
				}
			} else {
				setLoading(false)
				setStatus(EnergyText.text)
				setExpGain('')
				setTotalReward('')
			}
			setLoading(false)
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
		// Swal.fire({
		// 	icon: 'success',
		// 	title: 'Comming Soon.',
		// 	text: 'Please be patient, this functionality is coming soon.'
		// })
		// return

		try {
			const getWithdrawRequest = await axios.get(`${apiUrl}/api/withdrawRequest/userWithdrawRequest/${userId}/scholar`)
			if (getWithdrawRequest?.data?.withdrawRequest?.length > 0) {
				if (Object.keys(nonResolvedRewardRequest).length > 0) {
					Swal.fire({
						icon: 'error',
						title: 'You have a pending claim.',
						text: 'Please wait until your previous claim is resolved.'
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
									rewardParam.append('requesterAddress', userId)
									rewardParam.append('amount', earnerData.totalAmount)
									const postWithdraw = await axios.post(`${apiUrl}/api/withdrawRequest/scholar`, rewardParam, config)
									setTotalReward('')

									setEarnerData({...earnerData, totalAmount: 0})

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
					} else {
						Swal.fire({
							icon: 'error',
							title: 'Reward Claim Failed',
							text: 'something went wrong while creating request, Please contact admin.'
						})
					}
				}
			} else {
				try {
					if (parseInt(earnerData.totalAmount) > 0) {
						const rewardParam = new URLSearchParams()
						rewardParam.append('requesterAddress', userId)
						rewardParam.append('amount', earnerData.totalAmount)
						const postWithdraw = await axios.post(`${apiUrl}/api/withdrawRequest/scholar`, rewardParam, config)
						setTotalReward('')
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
		return <ChooseDearMonsterScholar handleonSelect={handleonSelect} selectedMonster={selectedMonster} userId={userId}
			updateMonsterAfterFight={updateMonsterAfterFight} />
	}, [updateMonsterAfterFight, selectedMonster, userId])


	const minion = useMemo(() => {
		return <ChooseMinion minionFight={minionFight} loading={loading} status={status} totalReward={totalReward} selectedMonster={selectedMonster}
			expGain={expGain}
		/>
	}, [status, loading, minionFight, totalReward, selectedMonster, expGain,])

	return (
		<div>


			{
				loading ?
					<div style={loaderParentStyle} className='loader-div'>
						<div style={loaderStyle}>
							{/* <Oval color='orange' ariaLabel='loading' /> */}
							<ClipLoader color='orange' loading={true} size={150} />
 
							<p style={textStyle} > Please wait for minion fight to be completed </p>
						</div>
					</div>
					:
					''
			}



			<CurrenPageTitle title='Training Ground (Scholar)'></CurrenPageTitle>
			{
				userId ?
					<>
						<div className='container center mt-8'>
							<div className='center flex-column'>
								<div className='border border-warning text-white p-2 rounded-2'>
									Total Rewards: {earnerData && Object.keys(earnerData).length > 0 ? Number(earnerData.totalAmount) : 0}
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
										<div className='modal-dialog modal-lg'>
                                            <div style={{ padding: "35px" }} className='instructionsBoard modal-content py-3 bg-dark text-white shadow-lg'>
                                                <div className='modal-body fs-25'>
												<div className='title'>
														<h3 className='modal-amount'>{'Approved Claims History'}</h3>
													</div>

													{claimHistory.length ? claimHistory.map((history, i) => {
														return (
															<div className='item' key={i}>
																<span className='modal-amount'>{`${i + 1}.`}</span>
																<span className='modal-amount'>{`${history.amount}`}</span>
																<span className='modal-amount'>
																	{`${ new Date(history.updatedAt).getMonth() + 1 }-${ new Date(history.updatedAt).getDate() }-2022`}
																	
																	</span>
																	{history.transactionHash &&
																<span className='modal-amount'>{`${history.transactionHash}`}</span>}

															</div>

														)
													}) : <span className='modal-amount'>{'No Claim History Found.'}</span> }
                                                    

                                                </div>
                                            </div>
                                        </div>
									</div>
								</section>
								<section className='mt-5 d-flex align-items-center '>
									<div className='header-Connect-btn py-3 px-4 w-140px center bold fs-13 cursor'
									onClick={() => claimRewardHandler()}>
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


						<NavLinks match={match} />


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