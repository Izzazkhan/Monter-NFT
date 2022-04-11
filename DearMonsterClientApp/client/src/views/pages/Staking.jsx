import React, { useState, useEffect } from 'react';
import { connectUserSuccess, startLoading, stopLoading } from '../../store/actions/auth/login';
import CurrenPageTitle from '../../components/common/CurrenPageTitle';
import { useSelector, useDispatch } from 'react-redux';
import { apiUrl } from '../../utils/constant'
import Swal from 'sweetalert2';
import axios from 'axios'
import { Wheel } from 'react-custom-roulette'
import NavLinks from '../../components/fortuneWheel/NavLinks';
import Loading from '../../components/common/Loading';

// const config = {
//     headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//         'Authorization': `xx Umaaah haaalaaa ${process.env.REACT_APP_APP_SECRET} haaalaaa Umaaah xx`
//     }
// }
// const match = { params: { slug: 'owned' } }

const Staking = (props) => {
    const { userId } = useSelector(state => state.auth)
    const dispatch = useDispatch();
    const [owner, setOwner] = useState(userId ? userId : null)
    const [stakeAmount, setStakeAmount] = useState('');
    const [stakeLength, setStakeLength] = useState('');
    // const [monsterArray, setMonsterArray] = useState([]);
    const monsterArray = [
        { end: 0, table_heading: "table td 3", progress: "progress-td-4", apy: {apyOne: "innerData", apyTwo: "innerData"}, principle: "table td 6", shares: "table td 6" },
        { end: 0, table_heading: "table td 3", progress: "progress-td-4", apy: "apy-td 5", principle: "table td 6", shares: "table td 6" },
        { end: 0, table_heading: "table td 3", progress: "progress-td-4", apy: "apy-td 5", principle: "table td 6", shares: "table td 6" }
    ]
    console.log(monsterArray);
 
    const handleChangeAmount = (e) => {
		e.preventDefault();
		setStakeAmount(e.target.value);
	};
    const handleChangeLength = (e) => {
		e.preventDefault();
		setStakeLength(e.target.value);
	};
    console.log(stakeAmount);
    console.log(stakeLength);


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

 
    return (
        <div>
            <CurrenPageTitle title='Staking'></CurrenPageTitle>
            <div className='container center mt-2 theme-bg mb-5'>
					<div className=''>
                        <div className='row'>
                            <div className='col-12'>
                                <div class="mb-5 center fw-bold fw-24 bold text-capitalize">stake</div>
                                <section class="center flex-column mt-9 staking text-lg-start text-center">
                                    <div class="mb-md-5 mb-4 stake-Form  position-relative">
                                        <input value={stakeAmount} onChange={handleChangeAmount} type="text" class="form-control filterCheckBtn" id="exampleFormControlInput1" placeholder="Stake Amount in HEX" />
                                        <div class="translate-right-middle end-5 mt-1 text-center">
                                            <span className='text-uppercase badge opacity'>max</span>
                                            <p className='fw-bold mb-0 text-uppercase text-white'>Hex</p>
                                        </div>
                                    </div>
                                    <div class="mb-md-5 mb-4 stake-Form position-relative">
                                        <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="Stake Length in Days" value={stakeLength} onChange={handleChangeLength} />
                                        <div class="translate-right-middle end-5 mt-1 text-center">
                                            <span className='text-dark badge opacity'>
                                                {/* <FontAwesomeIcon className='add-icon text-white m-0' icon={faCalendarDays } /> */}
                                                <i class="fa-solid fa-calendar-days text-white"></i>
                                            </span>

                                            <p className='fw-bold mb-0 text-uppercase text-white'>Hex</p>
                                        </div>
                                    </div>
                                </section>
                                <div className='stake-table shadow-scroll-x'>
                                    <table className='table table-responsive table-hover'>
                                            <thead className='th-bg'>
                                                <tr>
                                                    <th>
                                                        <div class="custom-select w-75 mt-1">
                                                        {/* <FontAwesomeIcon className='add-icon table-theme' icon={faArrowDown } /> */}
                                                        <i class="fa-solid fa-arrow-down table-theme"></i>
                                                            <div className='ms-2'>
                                                                <option value="all" className='table-theme'>start</option>
                                                                {/* <option value="asc">Top Price</option>
                                                                <option value="desc">Lowest Price</option> */}
                                                            </div>
                                                            
                                                        </div> 
                                                    </th>
                                                    <th>end</th>
                                                    <th>Table heading</th>
                                                    <th>progress</th>
                                                    <th className='p-0'>
                                                        <div className='d-flex align-items- justify-content-center mb-2'>
                                                            <span>%APY</span> <div className='qstn-icon ms-2'>
                                                                <i class="fa-solid fa-question text-white"></i>
                                                                </div>
                                                        </div>
                                                        <div className='d-flex justify-content-between align-items-center px-2 nested-th'>
                                                            <div className='mb-0'><span>progress</span></div>
                                                            <div className='mb-0'><span>%APY</span></div>
                                                            <div className='mb-0'><span>principle</span></div>
                                                        </div>
                                                    </th>  
                                                    <th>principle</th>
                                                    <th className='p-0'>
                                                        <div className='d-flex align-items-center justify-content-center mb-2'>
                                                            <span>T-Shares</span> <div className='qstn-icon ms-2'>
                                                                <i class="fa-solid fa-question text-white"></i>
                                                                </div>
                                                        </div>
                                                        <div className='d-flex justify-content-between align-items-center px-2 nested-th'>
                                                            <div className='mb-0'><span>progress</span></div>
                                                            <div className='mb-0'><span>%APY</span></div>
                                                            <div className='mb-0'><span>Principle</span></div>
                                                        </div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {monsterArray.map((item, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{item.end}</td>
                                                            <td>{item.table_heading}</td>
                                                            <td>{item.progress}</td>
                                                            <td>
                                                                {/* <div className='d-flex justify-content-between align-items-center'>
                                                                    <td>{item.apy.apyOne}</td>
                                                                    <td>{item.apy.apyTwo}</td>
                                                                    <td>{item.apy.apyOne}</td>
                                                                </div> */}
                                                                <div className='row'>
                                                                <div className='col-md-4'><td>{item.apy.apyOne}</td></div>
                                                                <div className='col-md-4'><td>{item.apy.apyOne}</td></div>
                                                                <div className='col-md-4'><td>{item.apy.apyOne}</td></div>
                                                                </div>
                                                            </td>  
                                                            <td>{item.principle}</td>
                                                            <td>{item.shares}</td>
                                                        </tr>
                                                    )
                                                })}                 
                                            </tbody>
                                    </table>
                                </div>
                            </div>
                        </div> 
					</div>
				</div>
            {/* <div className='container center mt-6'>
               <div className={`${userId} py-2 w-md-lg2 w-md2 mb-8`}>
                   <div className='center flex-column'>
                       <footer className='center flex align-items-center pb-4 mb-4'>
                           {userId ? (
                                <div className='container'>
                                    <div className='center'>
                                        <div>
                                            <p className='text-white mt-4 fs-23 bg-dark bg-opacity-50 p-3 rounded-3 w-auto'>
                                                Coming Soon
                                            </p>
                                        </div>
                                    </div>
                                </div>
                           ) : (
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
                           )}
                       </footer>
                   </div>
               </div>
           </div> */}
        </div>
    );
};

export default Staking
