import React, { useEffect, useMemo } from 'react';
import CurrenPageTitle from '../../components/common/CurrenPageTitle';
import ChooseDearMonster from '../../components/TrainingGround/ChooseDearMonster';
import ChooseMinion from '../../components/TrainingGround/ChooseMinion';
import axios from 'axios'
import { apiUrl } from '../../utils/constant';
import Swal from 'sweetalert2';
import Web3 from 'web3';
import { useSelector } from 'react-redux';

const isCommingSoon = true

const TrainingGround = () => {
	const [time, setTime] = React.useState('0d 0h 0m 0s');
	const [loading, setLoading] = React.useState(false);
	const [status, setStatus] = React.useState('')
	const [selectedMonster, setSelectedMonster] = React.useState({})
	const { userId } = useSelector((state) => state.auth);
	console.log('userId::', userId)
	const [account, setAccount] = useState();


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
		console.log('acount:::', accounts)
		setAccount(accounts[0]);
	}, [window.web3, userId])




	// const timer = useMemo(() => {
	// 	// get next 10 days from now
	// 	const countDownDate = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);
	// 	let x = setInterval(() => {
	// 		let now = new Date().getTime();
	// 		let distance = countDownDate - now;
	// 		let days = Math.floor(distance / (1000 * 60 * 60 * 24));
	// 		let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	// 		let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	// 		let seconds = Math.floor((distance % (1000 * 60)) / 1000);
	// 		if (minutes <= 0) {
	// 			setTime(`${seconds}s`);
	// 		} else if (hours <= 0) {
	// 			setTime(`${minutes}m ${seconds}s`);
	// 		} else if (days <= 0) {
	// 			setTime(`${hours}h ${minutes}m ${seconds}s`);
	// 		} else {
	// 			setTime(`${days}d ${hours}h ${minutes}m ${seconds}s`);
	// 		}
	// 		if (distance < 0) {
	// 			clearInterval(x);
	// 			setTime('EXPIRED');
	// 		}
	// 	}, 1000);
	// }, [time]);

	// useEffect(() => {
	// 	timer();
	// }, []);

	const handleonSelect = (monster) => {
		console.log('selected monster::', monster)
		setSelectedMonster(monster)
	}

	const apiCall = (params) => {
		const config = {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}
		axios.post(`${apiUrl}/api/mintedMonster/setEnergyTime/${selectedMonster.mintedId}`, params, config)
			.then((response) => {
				console.log('api response::', response)
			})
			.catch((error) => {
				console.log(error)
			})
	}

	// const reward = {minionA: [{ level: 1, amount: 25 }, { level: 2, amount: 40 }, { level: 3, amount: 76 }, { level: 4, amount: 210 }, { level: 5, amount: 500 }]}

	const minionFight = (minion) => {
		if (selectedMonster.values.Energy >= 1) {
			console.log('selected minion', minion)
			setLoading(true);
			const random = Math.floor(Math.random() * 100) + 1
			let status = '';
			if (random <= minion.values.Win_Rate) {
				status = 'WIN';
				setLoading(false);
				setStatus(status);
				let experienceCalculate = Number(selectedMonster.values.EXP) + minion.values.Exp_Gain
				let params = new URLSearchParams()
				params.append('values.EXP', experienceCalculate)
				apiCall(params)
				let amount = 0
				if (minion.values.Win_Rate === 45) {
					if (Number(selectedMonster.values.Level) === 1) {
						amount = 25
					}
					else if (Number(selectedMonster.values.Level) === 2) {
						amount = 40
					}
					else if (Number(selectedMonster.values.Level) === 3) {
						amount = 76
					}
					else if (Number(selectedMonster.values.Level) === 4) {
						amount = 210
					}
					else if (Number(selectedMonster.values.Level) === 5) {
						amount = 500
					}
				}
				else if (minion.values.Win_Rate === 51) {
					if (Number(selectedMonster.values.Level) === 1) {
						amount = 10
					}
					else if (Number(selectedMonster.values.Level) === 2) {
						amount = 16
					}
					else if (Number(selectedMonster.values.Level) === 3) {
						amount = 30.4
					}
					else if (Number(selectedMonster.values.Level) === 4) {
						amount = 84
					}
					else if (Number(selectedMonster.values.Level) === 5) {
						amount = 200
					}
				}

				// const config = {
				// 	headers: {
				// 		'Content-Type': 'application/x-www-form-urlencoded'
				// 	}
				// }
				// axios.post(`${apiUrl}/api/mintedMonster/setEnergyTime/${selectedMonster.mintedId}`, params, config)
				// 	.then((response) => {
				// 		console.log('api response::', response)
				// 	})
				// 	.catch((error) => {
				// 		console.log(error)
				// 	})

			} else {
				status = 'LOSE';
				setLoading(false);
				setStatus(status);
			}
			const energyCalculate = selectedMonster.values.Energy - 1
			let params = new URLSearchParams()
			params.append('values.Energy', energyCalculate)
			apiCall(params)
		} else {
			Swal.fire({
				icon: 'error',
				title: 'Energy',
				text: 'Dear Monster Energy should be greater than 0'
			})
		}
	}


	// const dearMonster = () => {
	// 	return <ChooseDearMonster handleonSelect={handleonSelect} />
	// }

	// const minion = () => {
	// 	return <ChooseMinion minionFight={minionFight} loading={loading} status={status} />
	// }

	return (
		<div>
			<CurrenPageTitle title='Training Ground'></CurrenPageTitle>
			{
				// isCommingSoon ?
				// 	<div className='center'>
				// 		<p className='text-white mt-9 sm-fs-29 fs-21 whiteSpace-nowrap'>
				// 			Coming Soon
				// 		</p>
				// 	</div>
				// 	:
				<>
					<div className='container center mt-8'>
						<div className='center flex-column'>
							<div className='border border-warning text-white p-2 rounded-2'>Total Rewards:</div>
							<section className='mt-5'>
								<div className='header-Connect-btn py-3 w-190px center bold fs-13 cursor'
									data-bs-toggle='modal'
									data-bs-target='#ClaimRewardHistory'>
									Claim Reward History
								</div>
								<div
									className='modal fade'
									id='ClaimRewardHistory'
									tabindex='-1'
									aria-labelledby='ClaimRewardHistoryLabel'
									aria-hidden='true'
								>
									<div className='modal-dialog'>
										<div className='modal-content py-3 bg-dark bg-opacity-75 text-white shadow-lg'>
											<div className='modal-body p-4'>
												Popup to show last 10 claims amount in DMS, datetime, status, tx id
											</div>
											<div className='modal-footer'>
												<button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>
													Close
												</button>
												<button type='button' className='btn btn-warning' data-bs-dismiss='modal'>
													Confirm
												</button>
											</div>
										</div>
									</div>
								</div>
							</section>
							<section className='mt-5 d-flex align-items-center '>
								<div className='header-Connect-btn py-3 px-4 w-140px center bold fs-13 cursor'
									data-bs-toggle='modal'
									data-bs-target='#ClaimReward'>
									Claim Reward
								</div>
								<div
									className='modal fade'
									id='ClaimReward'
									tabindex='-1'
									aria-labelledby='ClaimRewardLabel'
									aria-hidden='true'
								>
									<div className='modal-dialog'>
										<div className='modal-content py-3 bg-dark bg-opacity-75 text-white shadow-lg'>
											<div className='modal-body p-4'>
												Condition: 7 days (configurable) from last claim
												-popup confirmation page
												-rewards will be airdropped from admin wallet to user wallet to disburse the DMS
											</div>
											<div className='modal-footer'>
												<button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>
													Close
												</button>
												<button type='button' className='btn btn-warning' data-bs-dismiss='modal'>
													Confirm
												</button>
											</div>
										</div>
									</div>
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
								tabindex='-1'
								aria-labelledby='EarlyClaimModalLabel'
								aria-hidden='true'
							>
								<div className='modal-dialog'>
									<div className='modal-content py-3 bg-dark bg-opacity-75 text-white shadow-lg'>
										<div className='modal-body p-4'>
											30% tax -Allows the user to claim rewards with a 30% penalty. Ie for 100
											rewards, 70DMS is transferred from admin wallet to user wallet.
										</div>
										<div className='modal-footer'>
											<button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>
												Close
											</button>
											<button type='button' className='btn btn-warning' data-bs-dismiss='modal'>
												Confirm
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<ChooseDearMonster handleonSelect={handleonSelect} />
					<ChooseMinion minionFight={minionFight} loading={loading} status={status} />
				</>
			}
		</div>
	);
};

export default TrainingGround;
