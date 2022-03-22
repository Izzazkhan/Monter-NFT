import React, { useState, useEffect } from 'react';
import { connectUserSuccess, startLoading, stopLoading } from '../../store/actions/auth/login';
import CurrenPageTitle from '../../components/common/CurrenPageTitle';
import { useSelector, useDispatch } from 'react-redux';
import { apiUrl } from '../../utils/constant'
import Swal from 'sweetalert2';
import axios from 'axios'
import { Wheel } from 'react-custom-roulette'

const config = {
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Authorization': `xx Umaaah haaalaaa ${process.env.REACT_APP_APP_SECRET} haaalaaa Umaaah xx`
	}
}


const FortuneWheel = ({ }) => {
	const { userId } = useSelector(state => state.auth)
	const dispatch = useDispatch();
    // const [owner, setOwner] = useState(userId ? userId : null)
    const [slots, setSlots] = useState([])

    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);
    const [spinCost, setSpinCost] = useState(80)
    const [buyAs, setBuyAs] = useState('owner')

    const handleSpinClick = () => {

        let trackerArray = []
        let indexArray = []

        slots.forEach((item, index) => {

            trackerArray.push({name: item.option, number: index+1})
            for(let i=1; i<= item.probability; i++) {
                indexArray.push(index+1)
            }
        })

        //generate random number from 1 to 1000
        var random = Math.floor(Math.random() * 1000)

        let myValue =  indexArray[random - 1]

        let filterVal = trackerArray.find(item => item.number == myValue)

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
		// setOwner(accounts[0])
		dispatch(connectUserSuccess(accounts[0]))

        axios.get(`${apiUrl}/api/fortuneWheel`)
			.then((res) => {
                const slotsMapped = res.data.fortuneWheel[0].slots.map(item => {
                    return {
                        ...item,
                        probability: item.probability * 10
                    }
                }).sort((a, b) => b.probability - a.probability)
				setSlots(slotsMapped)
			})
			.catch((e) => {
				console.log("Error ----------------")
				console.log(e)
			})
	}

    const handleBuyAs = (e) => {
        setBuyAs(e.target.value)
    }

    const buySpinsHandler = () => {
        axios.get(`${apiUrl}/api/userEarning/${userId}/${buyAs}`)
        .then((response) => {
            if (response?.data?.earnerData) {
                const updateParams = new URLSearchParams()
                updateParams.append('earnerAddress', userId)
                updateParams.append('totalAmount', response.data.earnerData.totalAmount - Number(spinCost))

                axios.put(`${apiUrl}/api/userEarning/${userId}/${buyAs}`, updateParams, config)
                    .then((response) => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Reward Deduction',
                            text: `${spinCost} Rewards deducted from the ${buyAs} wallet`
                        })
                    })
                    .catch((error) => {
                        console.log(error)
                    })

            }
            // else {
            //     setEarnerData({})
            // }
        })
        .catch((error) => {
            console.log(error)
        })
    }

	return (
		<div>
			<CurrenPageTitle title='Fortune Wheel'></CurrenPageTitle>
			<div className='container center mt-6'>
				<div className={`${userId} py-2 w-md-lg2 w-md2 mb-8`}>
					<div className='center'>
						<img src='/assets/gif/Cave Animated.gif' alt='' className='w-75 mt-7' />
					</div>
					<div className='center fs-19 flex-column'>
						{/* {userId &&
							<div className='center'>
								<div className='header-Connect-btn py-3 w-190px center bold fs-13'>
									This is fortune wheel
								</div>
							</div>
						} */}
						
						<footer className='center mt-4 flex align-items-center pb-4 mb-4'>
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
                                        fontSize='25'
                                        />
                                        <span className="inner-first">SPIN</span>
                                        <span className="inner-second"></span>
                                        
                                    </div>
								</div>
							) : (
								<div
									className='header-Connect-btn h-40px center w-100px px-4 fs-16 bold cursor'
									onClick={handleConnect}
								>
									Connect
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
                                    <>
                                        <div
                                            className={`header-Connect-btn py-3 px-4 w-100px center bold fs-13 cursor`}
                                            data-bs-toggle='modal'
                                            data-bs-target={`#BuySpin`}
                                        >
                                            {'Buy Spins'}
                                        </div>
                                        <div className='modal fade' id={`BuySpin`} tabIndex='-1' aria-labelledby='BuySpinLabel' aria-hidden='true' >
                                            <div className='modal-dialog modal-lg'>
                                                <div style={{ padding: "35px" }} className='instructionsBoard modal-content py-3 bg-dark text-white shadow-lg'>

                                                    <div className='modal-header p-4 border-bottom-0' style={{ border: "none" }}> <h3 style={{ color: "black" }}>Spin Cost</h3>
                                                    </div>
                                                    <div className='modal-body p-4'>
                                                        <p className='mb-4' style={{ fontSize: "17px", fontWeight: "400", color: "black" }}>

                                                        </p>
                                                        <div className='align-items-center d-flex justify-content-between mb-4' >
                                                            <div> <h4 style={{ color: "black", fontSize: "15px" }}>Select Spin Cost</h4> </div>
                                                            <div className='d-flex align-items-center w-60 text-black'>
                                                                <select
                                                                    className='form-select w-75 mt-1'
                                                                    onChange={(e) => {
                                                                        setSpinCost(e.target.value);
                                                                    }}
                                                                >
                                                                    <option value={80}>1 Spin Cost</option>
                                                                    <option value={380}>5 Spin Cost</option>
                                                                </select>
                                                            </div>

                                                        </div>

                                                        <div className='align-items-center d-flex justify-content-between mb-4' >
                                                            <div> <h4 style={{ color: "black", fontSize: "15px" }}>Select Buy As</h4> </div>
                                                            <div className='d-flex align-items-center w-60 text-black'>
                                                                <select
                                                                    className='form-select w-75 mt-1'
                                                                    onChange={handleBuyAs}
                                                                >
                                                                    <option value={'owner'}>Owner</option>
                                                                    <option value={'scholar'}>Scholar</option>
                                                                </select>
                                                            </div>

                                                        </div>

                                                    </div>
                                                    <div className='modal-footer border-top-0 mb-5'>
                                                        {/* {
                                                            !post.scholarshipsItems.assigned ? */}
                                                            
                                                                <div className='header-Connect-btn h-40px center w-100px px-2 bold cursor' 
                                                                onClick={buySpinsHandler}
                                                                data-bs-dismiss='modal'
                                                                >
                                                                    Buy Spins
                                                                </div>
                                                                {/* :
                                                                <div className='header-Connect-btn h-40px center w-100px px-2 bold cursor' 
                                                                onClick={() => revokeFunction(post)}
                                                                data-bs-dismiss='modal'
                                                                >
                                                                    Revoke
                                                                </div>
                                                        } */}
                                                        <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
								</div>
                            )}
						</footer>
					</div>
			</div>
		</div>
	</div>
	);
};

export default FortuneWheel;
