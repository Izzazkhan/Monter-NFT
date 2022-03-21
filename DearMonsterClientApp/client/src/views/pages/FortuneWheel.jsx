import React, { useState, useEffect } from 'react';
import { connectUserSuccess, startLoading, stopLoading } from '../../store/actions/auth/login';
import CurrenPageTitle from '../../components/common/CurrenPageTitle';
import { useSelector, useDispatch } from 'react-redux';
import { apiUrl } from '../../utils/constant'
import Swal from 'sweetalert2';
import axios from 'axios'
import { Wheel } from 'react-custom-roulette'

const FortuneWheel = ({ }) => {
	const { userId } = useSelector(state => state.auth)
	const dispatch = useDispatch();
    // const [owner, setOwner] = useState(userId ? userId : null)
    const [slots, setSlots] = useState([])

    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);

    const handleSpinClick = () => {
        // const newPrizeNumber = Math.floor(Math.random() * slots.length) + 1
        // var randomObject = slots[Math.floor(Math.random() * slots.length)]
        // console.log('randomObject', randomObject)
        // setMustSpin(true)
        // setPrizeNumber(newPrizeNumber)

        let trackerArray = []
        let indexArray = []

        slots.forEach((item, index) => {

            trackerArray.push({name: item.option, number: index+1})
            for(let i=1; i<= item.probability; i++) {
                indexArray.push(index+1)
            }
        })

        // console.log("indexArray")
        // console.log(indexArray)

        //generate random number from 1 to 1000
        var random = Math.floor(Math.random() * 1000);

        // console.log("random")
        // console.log(random)

        let myValue =  indexArray[random - 1]

        // console.log("myValue")
        // console.log(myValue)

        let filterVal = trackerArray.find(item => item.number == myValue)

        // console.log("filterVal")
        // console.log(filterVal)

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
									<div className="wheel-wrapper">
                                        <Wheel
                                        mustStartSpinning={mustSpin}
                                        onStopSpinning={() => setMustSpin(!mustSpin)}
                                        prizeNumber={prizeNumber}
                                        data={slots}
                                        outerBorderColor='#E0E1DE'
                                        outerBorderWidth='15'
                                        innerBorderColor='#8B8B8B'
                                        innerBorderWidth='40'
                                        radiusLineColor='#eee'
                                        backgroundColors={['#123796', '#36AC03', '#C3430C', '#EECE0A', '#912862']}
                                        textColors={['#ffffff']}
                                        />
                                        <span className="inner-first"></span>
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
