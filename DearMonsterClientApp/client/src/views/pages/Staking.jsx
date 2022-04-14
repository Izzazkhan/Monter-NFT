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
const BUSDTokenAddress = appEnv === 'test' ? addressList.BUSDTokenAddress : addressList.BUSDTokenAddress

const StakingComponent = (props) => {
    const { userId } = useSelector(state => state.auth)
    const dispatch = useDispatch();
    const [owner, setOwner] = useState(userId ? userId : null)
    const [stakeAmount, setStakeAmount] = useState('');
    const [stakeLength, setStakeLength] = useState('');
    const [stakeInfoArray, setStakeInfoArray] = useState([]);
	const [loading, setLoading] = useState(false)
 
    const handleChangeAmount = (e) => {
		e.preventDefault();
		setStakeAmount(e.target.value);
	};
    const handleChangeLength = (e) => {
		e.preventDefault();
		setStakeLength(e.target.value);
	};

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
        setLoading(true)
        let StakingContract = new web3.eth.Contract(stakingAbi.abi, stakingAddress)
        const noOfStakes = await StakingContract.methods.getStakeCount().call({ from: accounts[0] })
        var indexArray = [];
        for (var i = 0; i < noOfStakes; i++) {
            indexArray.push(i);
        }
        const stakeInfoArray = indexArray.map(async (index) => {
            const stakeInfo = await StakingContract.methods.getStakeInfo(index).call({ from: accounts[0] })
            return {
                ...stakeInfo
            }
        })
        const resolvedArray = await Promise.all(stakeInfoArray)
        const mappedArray = resolvedArray.map(item => {
            const currentDaysCalculate = ( new Date().getTime() / (1000 * 60 * 60 * 24) ) - (Number(item['2']) / (60 * 60 * 24)) 
            // console.log('currentDaysCalculate', currentDaysCalculate)
            const stakeDaysCalculate = (Number(item['3']) - Number(item['2']))/( 60 * 60 * 24)
            // const stakeDaysCalculate = (( Number(item.endTime) / ( 60 * 60 * 24) ) - (Number(item.startTime) / (60 * 60 * 24)) )
            // console.log('stakeDaysCalculate', stakeDaysCalculate)
            const calculatePercentage = (currentDaysCalculate / stakeDaysCalculate) * 100
            // console.log('calculatePercentage', calculatePercentage)
            return {
                ...item,
                percentCompleted: calculatePercentage
            }
        })
        setStakeInfoArray(mappedArray)
        setLoading(false)
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
                    // const endDate = ( Math.floor(Date.now() / 1000) + (stakeLength * 86400) )
                    const endDate = ( Math.floor(new Date().getTime() / 1000) + (stakeLength * 86400) )
                    console.log('endDate', endDate)
                    await StakingToken.methods.approve(stakingAddress, web3.utils.toBN(amount.toString())).send({ from: userId });
                    await StakingContract.methods.stakeToken(web3.utils.toBN(amount.toString()), endDate).send({ from: userId })
                    dispatch(stopLoading(false))
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
            dispatch(startLoading(true))
            let web3 = window.web3
            let StakingContract = new web3.eth.Contract(stakingAbi.abi, stakingAddress)
                try {
                    await StakingContract.methods.unStakeToken(stakeId).send({ from: userId })
                    dispatch(stopLoading(false))
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
            // })
	}
    return (
        <div>
            <CurrenPageTitle title='Staking'></CurrenPageTitle>
            {loading ? <div className='center mt-6'><Loading /></div> : userId ? 
                <div className='container center mt-2 theme-bg mb-5'>
					<div className=''>
                        <div className='row'>
                            <div className='col-12'>
                                <div class="mb-5 center fw-bold fw-24 bold text-capitalize">stake</div>
                                <section class="center flex-column mt-9 staking text-lg-start text-center">
                                    <div class="mb-md-5 mb-4 stake-Form  position-relative">
                                        <input value={stakeAmount} onChange={handleChangeAmount} type="number" class="form-control filterCheckBtn" id="exampleFormControlInput1" placeholder="Stake Amount in USDC" />
                                        <div class="translate-right-middle end-5 mt-1 text-center">
                                            <span className='text-uppercase badge opacity'>max</span>
                                            <p className='fw-bold mb-0 text-uppercase text-white'>USDC</p>
                                        </div>
                                    </div>
                                    <div class="mb-md-5 mb-4 stake-Form position-relative">
                                        <input type="number" class="form-control" id="exampleFormControlInput1" placeholder="Stake Length in Days" value={stakeLength} onChange={handleChangeLength} />
                                        <div class="translate-right-middle end-5 mt-1 text-center">
                                            <span className='text-dark badge opacity'>
                                                <i class="fa-solid fa-calendar-days text-white"></i>
                                            </span>
                                            <p className='fw-bold mb-0 text-uppercase text-white'>Days</p>
                                        </div>
                                    </div>
                                    <div className={`header-Connect-btn h-40px w-100px center px-4 fs-16 bold cursor mb-4`} onClick={() => handleStaking()}>
                                        {'Staking'}
                                    </div>
                                </section>
                                <div className='stake-table shadow-scroll-x'>
                                    <table className='table table-responsive table-hover'>
                                            <thead className='th-bg'>
                                                <tr>
                                                    <th>Start Date</th>
                                                    <th>End Date</th>
                                                    <th>Percent Completed</th>
                                                    <th>APR%</th>
                                                    <th>Status</th>
                                                    <th>Action (Unstake button)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {stakeInfoArray.map((item, index) => {
                                                    // console.log('item', item)
                                                    return (
                                                        <tr key={index}>
                                                            <td>{formatDate(item['2'])}</td>
                                                            <td>{formatDate(item['3'])}</td>
                                                            <td>{`${item.percentCompleted.toFixed(6)}%`}</td>
                                                            <td>{item['4']}</td>
                                                            <td>{item['1'] ? 'Closed' : 'Active'}</td>
                                                            <td><div className={`header-Connect-btn h-40px w-100px center text-black px-4 fs-16 bold cursor`} onClick={() => handleUnstaking(item, index)}>
                                                                    {'Unstake'}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
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
