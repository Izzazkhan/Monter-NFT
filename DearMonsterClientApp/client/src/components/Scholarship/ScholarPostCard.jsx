import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { connectUserSuccess, startLoading, stopLoading } from '../../store/actions/auth/login';
import Web3 from 'web3';
import axios from 'axios'
import Swal from 'sweetalert2';

import { apiUrl, appEnv, addressList } from '../../utils/constant'

import DearMonsterTrading from '../../contracts/DearMonsterTrading.json';
import DearMonsterTradingTest from '../../contracts/DearMonsterTradingTest.json';

import DearMonster from '../../contracts/DearMonster.json';
import DearMonsterTest from '../../contracts/DearMonsterTest.json';

const nftContractAbi = appEnv === 'test' ? DearMonsterTest : DearMonster
const tradingContractAbi = appEnv === 'test' ? DearMonsterTradingTest : DearMonsterTrading

const nftContractAddress = appEnv === 'test' ? addressList.nftAddressTest : addressList.nftAddress
const tradingContractAddress = appEnv === 'test' ? addressList.tradingAddressTest : addressList.tradingAddress


const PostCard = ({ className, getData, post, stepImg, account }) => {
    console.log('post ==========', post)

    const [owner, setOwner] = useState(null);
    const [state, setState] = useState({ walletAddress: '', scholarName: '', managerName: '', profitToManager: '', profitToScholar: '', readMe: '' })

    const { userId } = useSelector(state => state.auth)
    const dispatch = useDispatch();



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState({
            ...state,
            [name]: value,
        });
    }

    console.log('state', state)


    const connectFunction = async () => {
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

    const scholarFunction = async (post) => {
        let params = new URLSearchParams()
        params.append('scholarID', state.walletAddress)
        params.append('scholarName', state.scholarName)
        params.append('managerName', state.managerName)
        params.append('readMe', state.readMe)
        params.append('profitShare.Manager_Share', state.profitToManager)
        params.append('profitShare.Scholar_Share', state.profitToScholar)

        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `xx Umaaah haaalaaa ${process.env.REACT_APP_APP_SECRET} haaalaaa Umaaah xx`
            }
        }
        axios.post(`${apiUrl}/api/scholarship/${post.mintedId}`, params, config)
            .then((response) => {
                Swal.fire({
                    icon: 'success',
                    title: 'Dear Monster Scholarship',
                    text: 'Dear Monster got on scholar successfully'
                })
            })
            .catch((error) => {
                console.log(error)
                Swal.fire({
                    icon: 'error',
                    title: 'Dear Monster Scholarship',
                    text: 'Error while getting on scholar'
                })
            })
    }

    const acceptScholarRequest = (post) => {
        console.log('post', post)
        let params = new URLSearchParams()
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `xx Umaaah haaalaaa ${process.env.REACT_APP_APP_SECRET} haaalaaa Umaaah xx`
            }
        }
        axios.put(`${apiUrl}/api/scholarship/${post.scholarshipsItems[0]._id}`, params, config)
            .then((response) => {
                Swal.fire({
                    icon: 'success',
                    title: 'Dear Monster Scholarship',
                    text: 'Dear Monster scholar is removed'
                })
            })
            .catch((error) => {
                console.log(error)
                Swal.fire({
                    icon: 'error',
                    title: 'Dear Monster Scholarship',
                    text: 'Error while removing scholar'
                })
            })
    }



    return (
        <div className={`${className}`}>
            <header className='center mb-3'>
                <div className='header-Connect-btn h-25px center px-1 w-90px fs-12'>{post?.id}</div>
            </header>
            <main className='center flex-column'>
                <div>
                    <img src={post?.img} className='w-md2' />
                </div>
                <div className='findDearMonster w-100   h-100 py-4 ' style={{ marginTop: '-55px' }}>
                    <p className='text-center mt-47px fs-18 bold'>{post?.title}</p>
                    <div className='center mt-5'>
                        <div>
                            {[...Array(post?.totalRating)].map((e, i) => {
                                return (
                                    <img key={i}
                                        src={
                                            post?.rating <= i ? '/assets/imgs/dimStar.png' : '/assets/imgs/star.png'
                                        }
                                        className='me-2'
                                    />
                                );
                            })}
                        </div>
                    </div>
                    <div className='text-white center flex-column mt-5 fs-18'>
                        {Object.keys(post?.values).map((key, index) => {
                            return (
                                <div className='mb-4' key={index}>
                                    <span className='me-2'>{key} :</span>
                                    <span>{post?.values[key]}</span>
                                </div>
                            );
                        })}
                        <div className='mb-4' >
                            <span className='me-2'>On scholarship</span>
                        </div>
                    </div>
                    <div className='center center mt-5 mb-4  fs-19 text-white'>
                        <p className='fs-30'>{post?.price}</p>
                    </div>
                </div>
            </main>
            <footer className='center mt-6'>
                {account || owner ?
                    (
                        <>
                            {post.scholarshipsItems.length ?
                                <>
                                    <div
                                        className='header-Connect-btn py-3 px-4 mt-6 w-140px center bold fs-13 cursor'
                                        data-bs-toggle='modal'
                                        data-bs-target={`#SellMonster${post?.id}`}
                                    >
                                        {post.scholarshipsItems[0].assigned ? 'View Scholar' : 'Pending on scholar'}
                                    </div>
                                    <div className='modal fade' id={`SellMonster${post?.id}`} tabIndex='-1' aria-labelledby='SellMonsterLabel' aria-hidden='true' >
                                        <div className='modal-dialog'>
                                            <div style={{ padding: "35px" }} className='instructionsBoard modal-content py-3 bg-dark text-white shadow-lg'>

                                                <div className='modal-header p-4 border-bottom-0' style={{ border: "none" }}> <h3 style={{ color: "black" }}> Scholar DearMonster </h3>
                                                </div>
                                                <div className='modal-body p-4'>
                                                    <p className='mb-4' style={{ fontSize: "17px", fontWeight: "400", color: "black" }}>

                                                    </p>
                                                    <div className='align-items-center d-flex justify-content-between mb-4' >
                                                        <div> <h4 style={{ color: "black" }}>Scholar Address</h4> </div>
                                                        <div className='d-flex align-items-center w-60' style={{ padding: "15px 15px 23px 3px" }}>
                                                            { }
                                                        </div>

                                                    </div>
                                                    <div className='align-items-center d-flex justify-content-between mb-4' >
                                                        <div> <h4 style={{ color: "black" }}>Scholar Name</h4> </div>
                                                        <div className='d-flex align-items-center w-60'>
                                                            {post.scholarshipsItems[0].scholarName}
                                                        </div>

                                                    </div>
                                                    <div className='align-items-center d-flex justify-content-between mb-4' >
                                                        <div> <h4 style={{ color: "black" }}>Manager Name</h4> </div>
                                                        <div className='d-flex align-items-center w-60'>
                                                            {post.scholarshipsItems[0].managerName}
                                                        </div>

                                                    </div>
                                                    <div className='align-items-center d-flex justify-content-between mb-4' >
                                                        <div> <h4 style={{ color: "black" }}>profitToManager</h4> </div>
                                                        <div className='d-flex align-items-center w-60'>
                                                            {post.scholarshipsItems[0].profitShare.Manager_Share}
                                                        </div>

                                                    </div>
                                                    <div className='align-items-center d-flex justify-content-between mb-4' >
                                                        <div> <h4 style={{ color: "black" }}>profitToScholar</h4> </div>
                                                        <div className='d-flex align-items-center w-60'>
                                                            {post.scholarshipsItems[0].profitShare.Scholar_Share}
                                                        </div>

                                                    </div>
                                                    <div className='align-items-center d-flex justify-content-between mb-4' >
                                                        <div> <h4 style={{ color: "black" }}>readMe</h4> </div>
                                                        <div className='d-flex align-items-center w-60'>
                                                            {post.scholarshipsItems[0].readMe}
                                                        </div>

                                                    </div>

                                                </div>
                                                <div className='modal-footer border-top-0 mb-5'>
                                                    {!post.scholarshipsItems[0].assigned &&
                                                        <div className='header-Connect-btn h-40px center w-100px px-2 bold  cursor' data-bs-dismiss='modal' onClick={() => acceptScholarRequest(post)}>
                                                            Accept
                                                        </div>}
                                                    <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div></> :
                                <>

                                </>
                            }
                        </>
                    )

                    :
                    (
                        <div className='header-Connect-btn h-40px center w-100px px-2 bold  cursor' onClick={() => connectFunction()}>
                            Connect
                        </div>
                    )}
            </footer>
        </div>
    );
};

export default PostCard;
