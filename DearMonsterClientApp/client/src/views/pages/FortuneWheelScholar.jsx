import React, { useState, useEffect } from 'react';
import { connectUserSuccess, startLoading, stopLoading } from '../../store/actions/auth/login';
import CurrenPageTitle from '../../components/common/CurrenPageTitle';
import { useSelector, useDispatch } from 'react-redux';
import { apiUrl } from '../../utils/constant'
import Swal from 'sweetalert2';
import axios from 'axios'
import { Wheel } from 'react-custom-roulette'
import NavLinks from '../../components/fortuneWheel/NavLinks';

const config = {
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Authorization': `xx Umaaah haaalaaa ${process.env.REACT_APP_APP_SECRET} haaalaaa Umaaah xx`
	}
}
const match = {params : { slug: 'scholar' }}

const FortuneWheelScholar = (props) => {
	const { userId } = useSelector(state => state.auth)
	const dispatch = useDispatch();
    const [owner, setOwner] = useState(userId ? userId : null)
    const [slots, setSlots] = useState([])

    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);
    const [spinCost, setSpinCost] = useState(80)
    const [buyAs, setBuyAs] = useState('scholar')
    const [updatedSpinData, setUpdatedSpinData] = useState([])
    const [spinRecord, setSpinRecord] = useState([])

    useEffect(() => {
        if(userId) {
            axios.get(`${apiUrl}/api/spinRecord`)
			.then((res) => {
                setUpdatedSpinData(res.data.spinRecord)
			})
			.catch((e) => {
				console.log("Error ----------------")
				console.log(e)
			})
        }
    }, [userId, spinRecord])

    useEffect(() => {
        if(userId) {
            axios.get(`${apiUrl}/api/fortuneWheel`)
			.then((res) => {
                const slotsMapped = res.data.fortuneWheel[0].slots.map(item => {
                    return {
                        ...item,
                        probability: item.probability * 10000
                    }
                }).sort((a, b) => b.probability - a.probability)
				setSlots(slotsMapped)
			})
			.catch((e) => {
				console.log("Error ----------------")
				console.log(e)
			})
        }
    }, [userId])

    // console.log('slots', slots)

    const spinUpdateCall = (filterValue) => {
        // console.log('filterValue', filterValue)
        const spinRecordParams = new URLSearchParams()
        spinRecordParams.append('userId', userId)
        spinRecordParams.append('type', buyAs)
        if(updatedSpinData.length) {
            const noOfspin = updatedSpinData.find(item => item.userId == userId && item.type == buyAs && item.no_of_spin)
            if(noOfspin) {
                // console.log('noOfspin', noOfspin)
                if(filterValue != undefined) {
                    spinRecordParams.append('no_of_spin', noOfspin.no_of_spin + Number(filterValue))
                } else {
                    spinRecordParams.append('no_of_spin', spinCost == 80 ? noOfspin.no_of_spin + 1 : noOfspin.no_of_spin + 5)
                }
                axios.put(`${apiUrl}/api/spinRecord/${userId}/${buyAs}`, spinRecordParams, config)
                .then((response) => {
                    setSpinRecord(response.data.spinRecord)
                    Swal.fire({
                        icon: 'success',
                        title: 'Spin Record',
                        text: `Spin record has been updated`
                    })
                })
                .catch((error) => {
                    console.log(error)
                })
            } else {
                if(filterValue != undefined) {
                    spinRecordParams.append('no_of_spin', Number(filterValue))
                } else {
                    spinRecordParams.append('no_of_spin', spinCost == 80 ? 1 : 5)
                }
                axios.post(`${apiUrl}/api/spinRecord`, spinRecordParams, config)
                .then((response) => {
                    // console.log('spin record', response)
                    setSpinRecord(response.data.spinRecord)
                    Swal.fire({
                        icon: 'success',
                        title: 'Spin Record',
                        text: `Spin record has been updated`
                    })
                })
                .catch((error) => {
                    console.log(error)
                })
            }
               
        } else {
            if(filterValue != undefined) {
                spinRecordParams.append('no_of_spin', filterValue)
            } else {
                spinRecordParams.append('no_of_spin', spinCost == 80 ? 1 : 5)
            }
            axios.post(`${apiUrl}/api/spinRecord`, spinRecordParams, config)
            .then((response) => {
                // console.log('spin record', response)
                setSpinRecord(response.data.spinRecord)
            })
            .catch((error) => {
                console.log(error)
            })
        }
    }

    const rewardUpdateCall = (DMSValue) => {
        axios.get(`${apiUrl}/api/userEarning/${userId}/${buyAs}`)
        .then((response) => {
            const updateParams = new URLSearchParams()
            updateParams.append('earnerAddress', userId)
            if (response?.data?.earnerData) {
                if(DMSValue != undefined) {
                    updateParams.append('totalAmount', response.data.earnerData.totalAmount + Number(DMSValue))
                    axios.put(`${apiUrl}/api/userEarning/${userId}/${buyAs}`, updateParams, config)
                        .then((response) => {
                            Swal.fire({
                                icon: 'success',
                                title: 'Reward Deduction',
                                text: `${spinCost} Rewards added to the ${buyAs} rewards`
                            })
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                } else if(response.data.earnerData.totalAmount - Number(spinCost) > 0) {
                    updateParams.append('totalAmount', response.data.earnerData.totalAmount - Number(spinCost))
                    axios.put(`${apiUrl}/api/userEarning/${userId}/${buyAs}`, updateParams, config)
                        .then((response) => {
                            Swal.fire({
                                icon: 'success',
                                title: 'Reward Deduction',
                                text: `${spinCost} Rewards deducted from the ${buyAs} rewards`
                            })
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: `Rewards cannot be deducted from the ${buyAs} wallet`
                    })
                }
            } else {
                 if (DMSValue != undefined){
                    updateParams.append('totalAmount', Number(DMSValue))
                    axios.put(`${apiUrl}/api/userEarning/${userId}/${buyAs}`, updateParams, config)
                        .then((response) => {
                            Swal.fire({
                                icon: 'success',
                                title: 'Reward Deduction',
                                text: `${spinCost} Rewards added to the ${buyAs} rewards`
                            })
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: `Rewards cannot be deducted from the ${buyAs} rewards`
                    })
                } 
            } 
        })
        .catch((error) => {
            console.log(error)
        })
    }

    const countUpdateCal = (filterValue) => {
        // console.log('filterValue', filterValue)
        axios.get(`${apiUrl}/api/userShard/${userId}/scholar`)
            .then((response) => {
            let params = new URLSearchParams()
            params.append('userId', userId)
            params.append('shardId', filterValue._id)
                // console.log('user shards', response, filterValue._id)
                const shardId = response.data.userShard.find(item => item.shardId === filterValue._id)
                // console.log('shardId', shardId, filterValue._id)
                if(response?.data?.userShard && shardId && shardId.shardId == filterValue._id) {
                    params.append('count', shardId.count + Number(filterValue.value))
                    axios.put(`${apiUrl}/api/userShard/${userId}/scholar/${shardId._id}`, params, config)
                    .then((res) => {
                        // console.log('put response:::::::::', res)
                        Swal.fire({
                        	icon: 'success',
                        	title: 'User Shard',
                        	text: `User shard has been created with count ${res.data.userShard.count}`
                        })
                    })
                    .catch((e) => {
                        console.log(e)
                        Swal.fire({
                        	icon: 'error',
                        	title: 'Error',
                        	text: 'Oops, Something went wrong'
                        })
                    })
                } else {
                    params.append('count', Number(filterValue.value))
                    params.append('type', 'scholar')
                    axios.post(`${apiUrl}/api/userShard`, params, config)
                    .then((res) => {
                        // console.log('post response:::::::::', res)
                        Swal.fire({
                            icon: 'success',
                        	title: 'User Shard',
                        	text: `User shard has been updated with count ${res.data.userShard.count}`
                        })
                    })
                    .catch((e) => {
                        console.log(e)
                        Swal.fire({
                        	icon: 'error',
                        	title: 'Error',
                        	text: 'Oops, Something went wrong'
                        })
                    })
                }
            })
            .catch((error) => {
                console.log(error)
            })
        }

    const BUSDRequestCall = async (filterValue) => {
        try {
			const getBUSDRequest = await axios.get(`${apiUrl}/api/BUSDRequest/${userId}/scholar`)

			if (getBUSDRequest?.data?.BUSDRequest_?.length > 0) {
                const filteredRequest = getBUSDRequest.data.BUSDRequest_.find(item => item.type === 'scholar')

                try {
                    if (filteredRequest) {
                        const params = new URLSearchParams()
                        params.append('amount', filteredRequest.amount + Number(filterValue.value))
                        const postRequest = await axios.put(`${apiUrl}/api/BUSDRequest/${userId}/scholar/${filteredRequest._id}`, params, config)
                        if (postRequest) {
                            Swal.fire({
                                icon: 'success',
                                title: 'BUSD Requested',
                                text: 'BUSD request has been updated'
                            })
                        }
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'BUSD Request',
                            text: 'Oops, Something went wrong, Please contact admin'
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
				try {
					if (Number(filterValue.value) > 0) {
						const params = new URLSearchParams()
						params.append('requesterAddress', userId)
						params.append('amount', Number(filterValue.value))
						const postRequest = await axios.post(`${apiUrl}/api/BUSDRequest/scholar`, params, config)
						if (postRequest) {
							Swal.fire({
								icon: 'success',
								title: 'BUSD Requested',
								text: 'BUSD request has been created'
							})
						}
					}
				} catch (error) {
					Swal.fire({
						icon: 'error',
						title: 'BUSD request',
						text: 'BUSD request failed, please try again'
					})
				}
			}
		} catch (error) {
			console.log(error)
		}
    }

    const handleSpinClick = () => {
        let trackerArray = []
        let indexArray = []
        slots.forEach((item, index) => {
            trackerArray.push({name: item.option, number: index+1, value: item.value, actionType: item.actionType, prob: item.probability, _id: item._id})
            for(let i=1; i<= item.probability; i++) {
                indexArray.push(index+1)
            }
        })

        //generate random number from 1 to 1000
        var random = Math.floor(Math.random() * 1000000)
        // console.log('random', random)

        let myValue =  indexArray[random - 1]
        // console.log('myValue', myValue)
        // console.log('trackerArray', trackerArray)
        let filterVal = trackerArray.find(item => item.number == myValue)
        // let filterVal = trackerArray[5]
        // console.log('filterVal', filterVal)
        if(filterVal.actionType === 'Free Spin') {
            setTimeout(() => {
                spinUpdateCall(filterVal.value)
            }, 11000);
        } else if(filterVal.actionType === 'DMS') {
            setTimeout(() => {
                rewardUpdateCall(filterVal.value)
            }, 11000);
        } else if(filterVal.actionType === 'Elemental Shard' || filterVal.actionType === 'Dearmonster Fragment' || filterVal.actionType === 'Dungeon Ticket') {
            setTimeout(() => {
                countUpdateCal(filterVal)
            }, 11000);
        } else if(filterVal.actionType === 'BUSD') {
            setTimeout(() => {
                BUSDRequestCall(filterVal)
            }, 11000);
        }

        let index = slots.findIndex(item => item.option === filterVal.name)
        setPrizeNumber(index)
        setMustSpin(true)
    }

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
	}

    const handleBuyAs = (e) => {
        setBuyAs(e.target.value)
    }

    const buySpinsHandler = () => {
        rewardUpdateCall()
        spinUpdateCall()
    }

	return (
		<div>
			<CurrenPageTitle title='Fortune Wheel'></CurrenPageTitle>
            {userId &&
                <div className='container center mt-8'>
                    <div className='center flex-column'>
                        <div className='border border-warning text-white p-2 rounded-2'>
                            No of spins: {`${updatedSpinData.length ? (updatedSpinData.find(item => item.type === 'scholar') ? 
                            updatedSpinData.find(item => item.type === 'scholar').no_of_spin : 0) : 0}`}
                        </div>
                        <section className='mt-5'>
                            <div className='header-Connect-btn py-3 w-190px center bold fs-13 cursor'
                                data-bs-toggle='modal'
                                data-bs-target='#BuySpin'>
                                Buy Spin
                            </div>
                            <div className='modal fade' id={`BuySpin`} tabIndex='-1' aria-labelledby='BuySpinLabel' aria-hidden='true' >
                                    <div className='modal-dialog modal-lg'>
                                        <div style={{ padding: "35px" }} className='instructionsBoard modal-content py-3 bg-dark text-white shadow-lg'>

                                            <div className='modal-header center p-4 border-bottom-0' style={{ border: "none" }}> <h3 style={{ color: "black" }}>Spin Cost</h3>
                                            </div>
                                            <div className='modal-body p-4'>
                                                <p className='mb-4' style={{ fontSize: "17px", fontWeight: "400", color: "black" }}>

                                                </p>
                                                <div className='align-items-center d-flex justify-content-between mb-4' >
                                                    <div> <h4 style={{ color: "black", fontSize: "15px", marginLeft: '25px' }}>Select Spin Cost</h4> </div>
                                                    <div className='d-flex align-items-center w-60 text-black'>
                                                        <select
                                                            className='form-select w-75 mt-1'
                                                            onChange={(e) => {
                                                                setSpinCost(e.target.value);
                                                            }}
                                                        >
                                                            <option value={80}>1 Spin Cost (80 DMS)</option>
                                                            <option value={380}>5 Spin Cost (380 DMS)</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className='align-items-center d-flex justify-content-between mb-4' >
                                                    <div> <h4 style={{ color: "black", fontSize: "15px", marginLeft: '25px' }}>Select Buyer</h4> </div>
                                                    <div className='d-flex align-items-center w-60 text-black'>
                                                        <select
                                                            className='form-select w-75 mt-1'
                                                            onChange={handleBuyAs}
                                                        >
                                                            <option value={'scholar'}>Scholar</option>
                                                            <option value={'owner'}>Owner</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className='align-items-center d-flex justify-content-between mb-4' >
                                                    <div></div>
                                                    <div className='d-flex align-items-center w-60 text-black'>
                                                        <h4 style={{ color: "black", fontSize: "15px" }}>{`${spinCost} DMS will be deducted from ${buyAs} Wallet`}</h4>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className='modal-footer border-top-0 mb-5'>
                                                <div className='header-Connect-btn h-40px center w-100px px-2 bold cursor' 
                                                onClick={buySpinsHandler}
                                                data-bs-dismiss='modal'
                                                >
                                                    Buy Spins
                                                </div>
                                                <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        </section>    
                    </div>
                </div>
			}
            {userId && <NavLinks match={match} />}
			<div className='container center mt-6'>
				<div className={`${userId} py-2 w-md-lg2 w-md2 mb-8`}>
					<div className='center'>
						<img src='/assets/gif/Cave Animated.gif' alt='' className='w-75 mt-7' />
					</div>
					<div className='center flex-column'>
						
						<footer className='center flex align-items-center pb-4 mb-4'>
							{userId ? (
								<div>
                                <div className={`wheel-wrapper  ${mustSpin ? 'rotate' :''} `}>
                                    <Wheel
                                    mustStartSpinning={mustSpin}
                                    onStopSpinning={() => setMustSpin(!mustSpin)}
                                    prizeNumber={prizeNumber}
                                    data={slots}
                                    outerBorderColor='#E0E1DE'
                                    outerBorderWidth='15'
                                    innerBorderColor='#051746'
                                    innerBorderWidth='40'
                                    radiusLineColor='#b1b1b1'
                                    radiusLineWidth='2'
                                    backgroundColors={['#123796', '#36AC03', '#C3430C', '#EECE0A', '#912862']}
                                    textColors={['#ffffff']}
                                    fontSize='13'
                                    />
                                    <span className="inner-first">SPIN</span>
                                    <span className="inner-second"></span>
                                    
                                </div>
								</div>
							) : (
                                <div className='container'>
                                    <div className='center'>
                                        <div>
                                            <p className='text-white mt-4 fs-23 bg-dark bg-opacity-50 p-3 rounded-3 w-auto'>
                                                Please connect to see Fortune
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
							)}
						</footer>
					</div>

                    <div className='center fs-19 flex-column'>
						<footer className='center mt-2 flex align-items-center pb-4 mb-4'>
							{userId && (
								<div>
                                    <div className="header-Connect-btn h-40px center w-100px px-4 fs-16 bold cursor" onClick={handleSpinClick}>
                                        Spin
                                    </div>
								</div>
                            )}
						</footer>
					</div>
			</div>
		</div>
	</div>
	);
};

export default FortuneWheelScholar;
