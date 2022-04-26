import React, { useState, useEffect } from 'react';
import { connectUserSuccess, startLoading, stopLoading } from '../../store/actions/auth/login';
import CurrenPageTitle from '../../components/common/CurrenPageTitle';
import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { appEnv, addressList } from '../../utils/constant'
import Staking from '../../contracts/Staking.json';
import StakingTest from "../../contracts/StakingTest.json";
import BUSDToken from '../../contracts/BUSDToken.json';
import BUSDTokenTest from "../../contracts/BUSDTestToken.json";
import { notification } from "../../utils/notification";
import Loading from '../../components/common/Loading';

const stakingAbi = appEnv === 'test' ? StakingTest : Staking
const stakingAddress = appEnv === 'test' ? addressList.stakingAddressTest : addressList.stakingAddress

const BUSDTokenAbi = appEnv === 'test' ? BUSDTokenTest : BUSDToken
const BUSDTokenAddress = appEnv === 'test' ? addressList.BUSDTokenAddressTest : addressList.BUSDTokenAddress

const StakingComponent = (props) => {
    const { userId } = useSelector(state => state.auth)
    const dispatch = useDispatch();
    const [owner, setOwner] = useState(userId ? userId : null)
    const [stakeAmount, setStakeAmount] = useState('');
    const [stakeLength, setStakeLength] = useState('');
    const [stakeInfoArray, setStakeInfoArray] = useState([]);
    const [istakeUpdate, setIstakeUpdate] = useState(false);
	const [loading, setLoading] = useState(false)
	const [APR, setAPR] = useState('')
 
    const handleChangeAmount = (e) => {
		e.preventDefault();
		setStakeAmount(e.target.value);
	};
    const handleChangeLength = (e) => {
		e.preventDefault();
		setStakeLength(e.target.value);
	};

    useEffect(async () => {
        if(userId) {
            setLoading(true)
            let web3 = window.web3
            let StakingContract = new web3.eth.Contract(stakingAbi.abi, stakingAddress)
            const getAPR = await StakingContract.methods.getCurrentAPR().call({ from: userId })
            setAPR(getAPR)
            const noOfStakes = await StakingContract.methods.getStakeCount().call({ from: userId })
            var indexArray = [];
            for (var i = 0; i < noOfStakes; i++) {
                indexArray.push(i);
            }
            const stakeInfoArray = indexArray.map(async (index) => {
                const stakeInfo = await StakingContract.methods.getStakeInfo(index).call({ from: userId })
                return {
                    ...stakeInfo
                }
            })
            const resolvedArray = await Promise.all(stakeInfoArray)
            const mappedArray = resolvedArray.map(item => {
                // const currentDaysCalculate = ( new Date().getTime() / (1000 * 60 * 60 * 24) ) - (Number(item['2']) / (60 * 60 * 24)) 
                const currentDaysCalculate = ( Date.now() / (1000 * 60 * 60 * 24) ) - (Number(item['2']) / (60 * 60 * 24)) 
                const stakeDaysCalculate = (Number(item['3']/( 60 * 60 * 24)) - Number(item['2'])/( 60 * 60 * 24))
                const calculatePercentage = (currentDaysCalculate / stakeDaysCalculate) * 100
                return {
                    ...item,
                    percentCompleted: calculatePercentage
                }
            })
            setStakeInfoArray(mappedArray)
            setLoading(false)
        }
    }, [userId, istakeUpdate])

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

    const formatDate = (date) => {
        const milliseconds = date * 1000 
        const dateObject = new Date(milliseconds)           
        const humanDateFormat = dateObject.toLocaleString()
        return humanDateFormat
    };

    const handleStaking = async () => {
        if (!userId) return

        if(Number(stakeLength) >= 14) {
            dispatch(startLoading(true))
            let web3 = window.web3
            let StakingToken = new web3.eth.Contract(BUSDTokenAbi.abi, BUSDTokenAddress)
            let StakingContract = new web3.eth.Contract(stakingAbi.abi, stakingAddress)
    
            StakingToken.methods.balanceOf(userId).call().then(async function (balance) {
    
                var _amount = Number(stakeAmount * 10 ** 18);
                var amount = _amount.toLocaleString('fullwide', { useGrouping: false })
                if (_amount >= balance) {
                    let notify = notification({
                        type: 'error',
                        message: 'Insufficient fund!',
                    });
                    dispatch(stopLoading(false))
                    notify();
                    return
                }
    
                try {
                    const endDate = (stakeLength * 86400) // ( Math.floor(Date.now() / 1000) + (stakeLength * 86400) )
                    // const endDate = ( Math.floor(new Date().getTime() / 1000) + (stakeLength * 86400) )
                    await StakingToken.methods.approve(stakingAddress, web3.utils.toBN(amount.toString())).send({ from: userId });
                    await StakingContract.methods.stakeToken(web3.utils.toBN(amount.toString()), endDate).send({ from: userId })
                    dispatch(stopLoading(false))
                    setIstakeUpdate(!istakeUpdate)
                    Swal.fire({
                        icon: 'success',
                        title: 'Staking',
                        text: `${stakeAmount} amount has been staked`
                    })
                } catch (e) {
                    dispatch(stopLoading(false))
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Transaction was rejected from Metamask'
                    })
                    console.log("Error ----------------")
                    console.log(e)
                }
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Minimum days should be 14'
            })
        }
	}
    
    const handleUnstaking = async (item, stakeId) => {

		let web3 = window.web3
        let StakingContract  = new web3.eth.Contract(stakingAbi.abi, stakingAddress);
        let currentStake = stakeInfoArray[stakeId];

        let currentDate = parseInt( Date.now() / 1000 )
        let endTime = parseInt(item[3])
        
        if(currentDate < endTime){
            let currentPenalty = web3.utils.fromWei(currentStake[5], 'ether');

            Swal.fire({
                icon: 'warning',
                title: 'Are you sure!',
                text: `Emergency unstake penalty will be: ${currentPenalty} BUSD`,
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, Unstake!'
            }).then( async (result) => {
                if (result.isConfirmed) {
                    dispatch(startLoading(true))
                    try {
                        await StakingContract.methods.unStakeToken(stakeId).send({ from: userId })
                        dispatch(stopLoading(false))
                        setIstakeUpdate(!istakeUpdate)
                    } catch (e) {
                        dispatch(stopLoading(false))
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Transaction was rejected from Metamask'
                        })
                        console.log("Error ----------------")
                        console.log(e)
                    }
                }
                
            })

        } else {
            dispatch(startLoading(true))
            try {
                await StakingContract.methods.unStakeToken(stakeId).send({ from: userId })
                dispatch(stopLoading(false))
                setIstakeUpdate(!istakeUpdate)
            } catch (e) {
                dispatch(stopLoading(false))
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Transaction was rejected from Metamask'
                })
                console.log("Error ----------------")
                console.log(e)
            }
        }

	}
    return (
        <div>
            <CurrenPageTitle title='Staking'></CurrenPageTitle>
            {loading ? <div className='center mt-6'><Loading /></div> : userId ? 
                <div className='container center mt-2 theme-bg mb-5'>
					<div className=''>
                        <div className='row'>
                            <div className='col-12'>
                                <section className="center flex-column mt-9 staking text-lg-start text-center mb-5">
                                    <div className="mb-md-5 mb-4 stake-Form  position-relative">
                                        <input value={stakeAmount} onChange={handleChangeAmount} type="number" className="form-control filterCheckBtn" id="exampleFormControlInput1" placeholder="Stake Amount in BUSD" />
                                        <div className="translate-right-middle end-5 mt-1 text-center">
                                            <span className='text-uppercase badge opacity'>max</span>
                                            <p className='fw-bold mb-0 text-uppercase text-white'>BUSD</p>
                                        </div>
                                    </div>
                                    <div className="mb-md-5 mb-4 stake-Form position-relative">
                                        <input type="number" className="form-control" id="exampleFormControlInput1" placeholder="Stake Length in Days" value={stakeLength} onChange={handleChangeLength} />
                                        <div className="translate-right-middle end-5 mt-1 text-center">
                                            <span className='text-dark badge opacity'>
                                                <i className="fa-solid fa-calendar-days text-white"></i>
                                            </span>
                                            <p className='fw-bold mb-0 text-uppercase text-white'>Days</p>
                                        </div>
                                    </div>
                                    <div className={`header-Connect-btn h-40px w-100px center px-4 fs-16 bold cursor mb-4`} onClick={() => handleStaking()}>
                                        {'Stake'}
                                    </div>
                                </section>
                                <div className='stake-table shadow-scroll-x mt-5'>
                                    <table className='table table-responsive table-hover'>
                                            <thead className='th-bg'>
                                                <tr>
                                                    <th>Start Date</th>
                                                    <th>End Date</th>
                                                    <th>Percent Completed</th>
                                                    <th>APR%</th>
                                                    <th>Status</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {stakeInfoArray.length && stakeInfoArray.map((item, index) => {
                                                    if(!item['1']){
                                                        return (
                                                            <tr key={index}>
                                                                <td><p> {formatDate(item['2'])} </p></td>
                                                                <td><p> {formatDate(item['3'])} </p></td>
                                                                <td><p> {`${item.percentCompleted.toFixed(3)}%`} </p></td>
                                                                <td><p> {APR}% </p></td>
                                                                <td><p> {item['1'] ? 'Closed' : 'Active'} </p></td>
                                                                <td><div className={`header-Connect-btn h-40px w-100px center text-black px-4 fs-16 bold cursor`} onClick={() => handleUnstaking(item, index)}>
                                                                        {'Unstake'}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )
                                                    }
                                                })}                 
                                            </tbody>
                                    </table>
                                </div>
                            </div>
                        </div> 
					</div>
				</div> :
                <div className='container center mt-6'>
                    <div className={`${userId} py-2 w-md-lg2 w-md2 mb-8`}>
                        <div className='center flex-column'>
                            <footer className='center flex align-items-center pb-4 mb-4'>
                                    <div className='container'>
                                        <div className='center'>
                                            <div>
                                                <p className='text-white mt-4 fs-23 bg-dark bg-opacity-50 p-3 rounded-3 w-auto'>
                                                    Please connect for Staking
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
                            </footer>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default StakingComponent
