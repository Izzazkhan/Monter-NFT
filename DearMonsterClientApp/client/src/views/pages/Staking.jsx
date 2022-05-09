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
// import coin from '../../../public/assets/imgs/coin.png'
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
   const [BUSDBalance, setBUSDBalance] = useState('')
   const [modalOpen, setModalOpen] = useState('NotModal')

   const handleChangeAmount = (e) => {
      e.preventDefault();
      setStakeAmount(e.target.value);
   };

   const onChangeSlider = (e) => {
        e.preventDefault();
        setStakeAmount(e.target.value);
   }

   const handleChangeLength = (e) => {
      e.preventDefault();
      setStakeLength(e.target.value);
   };

   const onChangeWeek = (days) => {
        setStakeLength(days);
   }

   useEffect(async () => {
      if (userId) {
         setLoading(true)
         let web3 = window.web3
         let StakingToken = new web3.eth.Contract(BUSDTokenAbi.abi, BUSDTokenAddress)
         const balance = await StakingToken.methods.balanceOf(userId).call()
         setBUSDBalance(balance / 10 ** 18)

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
         const mappedArray = resolvedArray.map((item, index) => { 
            const currentDaysCalculate = (Date.now() / (1000 * 60 * 60 * 24)) - (Number(item['2']) / (60 * 60 * 24))

            const profit = getAPR / (100 * (item['0'] / 10 ** 18))
            const dailyProfit = ( profit / 12 ) / 30 
            // const hourlyProfit = dailyProfit / 24
            const DMSProfit = dailyProfit * currentDaysCalculate

            const stakeDaysCalculate = (Number(item['3'] / (60 * 60 * 24)) - Number(item['2']) / (60 * 60 * 24))
            const calculatePercentage = (currentDaysCalculate / stakeDaysCalculate) * 100

            return {
               ...item,
               passedDays: currentDaysCalculate,
               DMSProfit: DMSProfit,
               percentCompleted: calculatePercentage
            }
         })
         const penaltyMapped = mappedArray.map((item, index) => {
            let currentStake = mappedArray[index]
            let currentPenalty = web3.utils.fromWei((currentStake[5]), 'ether');
             return {
                 ...item,
                 currentPenalty: currentPenalty
             }
         })

         setStakeInfoArray(penaltyMapped)
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

   const handleStaking = async () => {
      if (!userId) return

      if (Number(stakeLength) >= 14) {
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
               setModalOpen('modal')
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
      let StakingContract = new web3.eth.Contract(stakingAbi.abi, stakingAddress);
      let currentStake = stakeInfoArray[stakeId];

      let currentDate = parseInt(Date.now() / 1000)
      let endTime = parseInt(item[3])

      if (currentDate < endTime) {
         let currentPenalty = web3.utils.fromWei(currentStake[5], 'ether');

         Swal.fire({
            icon: 'warning',
            title: 'Are you sure!',
            text: `Emergency unstake penalty will be: ${currentPenalty} BUSD`,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Unstake!'
         }).then(async (result) => {
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
                        <section className='mt-5 center'>
                                <div className='header-Connect-btn py-3 w-190px center bold fs-13 cursor'
                                    data-bs-toggle='modal'
                                    data-bs-target='#exampleModal'>
                                    Stack BUSD
                                </div>
                                <div className='modal fade' id={`exampleModal`} tabIndex='-1' aria-labelledby='exampleModalLabel' aria-hidden='true' >
                                    <div className='modal-dialog modal-lg'>
                                        <div style={{ padding: "35px" }} className='instructionsBoard modal-content py-3 bg-dark shadow-lg'>

                                            <div className='modal-header center p-4 mt-6 border-bottom-0' style={{ border: "none" }}> <h3 className='text-black'>Stack BUSD</h3>
                                            </div>
                                    <div className='modal-body'>
                                        <div className='d-flex justify-content-between align-items-center'>
                                            <h5 className='text-uppercase mb-4 modalMargin'>BUSD to Lock</h5>
                                            <div className='d-flex align-items-center'>
                                                <div className='cake-img'>
                                                    <img src='/assets/imgs/coin.png ' />
                                                </div>
                                            </div>
                                        </div>
                                    <div className='d-flex align-items-center mb-1'>
                                       <input value={stakeAmount} onChange={handleChangeAmount} type="number" class="form-control modalMargin staking-usd-form p-3 filterCheckBtn me-2" id="exampleFormControlInput1" placeholder="Stake Amount in BUSD" />
                                    </div>
                                    <p className='text-end modalMargin'>Balance: {BUSDBalance}</p>
                                    <div className='input-slider mb-4 modalMargin mt-1'>
                                       <input type="range" class="form-range slider" id="customRange1" onChange={onChangeSlider} 
                                            min="0"
                                            max={`${BUSDBalance}`}
                                            step="0.01"
                                            value={stakeAmount}
                                       />
                                    </div>
                                    <h5 className='text-uppercase mb-4 modalMargin'>Add Duration</h5>

                                    <ul className='duration-week list-unstyled d-flex modalMargin'>
                                       <li onClick={() => onChangeWeek(14)}><a>2w</a></li>
                                       <li onClick={() => onChangeWeek(21)}><a>3w</a></li>
                                       <li onClick={() => onChangeWeek(28)}><a>4w</a></li>
                                       <li className='me-0' onClick={() => onChangeWeek(35)}><a>5w</a></li>
                                    </ul>

                                    <div className='d-flex align-items-center mb-5'>
                                       <input value={stakeLength} onChange={handleChangeLength} type="number" class="form-control modalMargin staking-week-form p-3 filterCheckBtn me-2" id="exampleFormControlInput1" placeholder="Stake Length in Days" />
                                       <span className='week'>Days</span>
                                    </div>

                                    <h5 className='text-uppercase modalMargin'>Lock Overview</h5>
                                    <div>
                                        <section className='modalLock mt-2 bold fs-17 center mx-auto h-70px' style={{height: '160px'}}>
                                        <div className='innerModal'>
                                            <div className='row'>
                                                <div className='col-md-8'>
                                                    <label>DMS to be Locked</label>
                                                </div>
                                                <div className='col-md-2'>
                                                    <span>{stakeAmount ? stakeAmount : '0'}</span>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-md-8'>
                                                    <label>APY</label>
                                                </div>
                                                <div className='col-md-2'>
                                                    <span>{`${APR}%`}</span>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-md-8'>
                                                    <label>Duration</label>
                                                </div>
                                                <div className='col-md-2'>
                                                    <span>{`${stakeLength} Days`}</span>
                                                </div>
                                            </div>
                                        </div>
                                        </section>
                                    </div>
                                </div>
                                    <div className='modal-footer border-top-0 mb-8'>
                                        <div className='header-Connect-btn h-40px center w-100px px-2 bold cursor'
                                            onClick={() => handleStaking()}
                                        >
                                            Confirm
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

                     {stakeInfoArray.length && stakeInfoArray.map((item, index) => {
                        if (!item['1']) {
                            return (
                                <div className='col-lg-6'>
                                    <div className='staking-card'>
                                    <div className="card">
                                        <div className='card-header'>
                                            <div className='d-flex justify-content-between align-items-center'>
                                                <div>
                                                <h2 className='card-title'>DMS TOKEN</h2>
                                                <h4 className='card-subtitle'>Staking</h4>
                                                </div>
                                                <div className='position-relative'>
                                                <div className='cake-img'>
                                                    <img src='/assets/imgs/coin.png' />
                                                </div>
                                                <div className='cake-bottom-img'>
                                                    <img src='/assets/imgs/coin.png' />
                                                </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="card-body">
                                            <div className='d-flex justify-content-between align-items-center apy'>
                                                <span className='text-uppercase'>APY:</span>
                                                <span className='apy-value'>{`${APR}%`}</span>
                                            </div>
                                            <div className='d-flex justify-content-between align-items-center mb-2'>
                                                <span>DMS Profit:</span>
                                                <span>{item.DMSProfit}</span>
                                            </div>
                                            <div className='d-flex justify-content-between align-items-center mb-5'>
                                                <span >Penalty from contract</span>
                                                <span >{Math.floor(item.passedDays) > 14 ? `${0}d` : `${14 - Math.floor(item.passedDays)}d`}</span>
                                            </div>
                                            <span className='text-uppercase'>Stacked amount</span>
                                            <div className='d-flex justify-content-between align-items-center'>
                                                 <div>
                                                <p className='usd-price'>{item['0']/10 ** 18}</p>
                                                {/* <span>~22.32 USD</span> */}
                                                </div> 
                                                {/*<div className='add-subtract-btn d-flex'>
                                                <button className='btn me-2'>-</button>
                                                <button className='btn'>+</button>
                                                </div> */}
                                            </div>
                                        </div>
                                        <div className='card-footer'>
                                            <div className='d-flex justify-content-between align-items-center'>
                                                <button className='auto-btn btn' onClick={() => handleUnstaking(item, index)}>Unstake</button>
                                                {/* <div class="dropdown">
                                                <button class="btn dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                                    Dropdown button
                                                </button>
                                                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                    <li><a class="dropdown-item" href="#">Action</a></li>
                                                    <li><a class="dropdown-item" href="#">Another action</a></li>
                                                    <li><a class="dropdown-item" href="#">Something else here</a></li>
                                                </ul>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            )
                        }
                    })}
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
