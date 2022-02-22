import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { connectUserSuccess, startLoading, stopLoading } from '../../store/actions/auth/login';
import axios from 'axios'
import Swal from 'sweetalert2';

import { apiUrl } from '../../utils/constant'


const PostCard = ({ className, getData, post, stepImg, account }) => {

    const [owner, setOwner] = useState(null);

    const { userId } = useSelector(state => state.auth)
    const dispatch = useDispatch();


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

    const acceptScholarRequest = (post) => {
        let params = new URLSearchParams()
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `xx Umaaah haaalaaa ${process.env.REACT_APP_APP_SECRET} haaalaaa Umaaah xx`
            }
        }
        axios.put(`${apiUrl}/api/scholarship/${post.scholarshipsItems._id}`, params, config)
            .then((response) => {
                getData(account)
                Swal.fire({
                    icon: 'success',
                    title: 'Dear Monster Scholarship',
                    text: 'Request for scholar accepted successfully'
                })
            })
            .catch((error) => {
                console.log(error)
                Swal.fire({
                    icon: 'error',
                    title: 'Dear Monster Scholarship',
                    text: 'Error while accepting request'
                })
            })
    }


	const revokeFunction = (post) => {
		const config = {
			headers: {
				'Authorization': `xx Umaaah haaalaaa ${process.env.REACT_APP_APP_SECRET} haaalaaa Umaaah xx`
			}
		}
		axios.delete(`${apiUrl}/api/scholarship/${post.mintedId}`, config)
			.then((response) => {
                getData(account)
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
                            <span className='me-2'>On scholarship:</span>
                            <span>{!post.scholarshipsItems.assigned ? 'Pending' : 'Accepted' }</span>

                            
                        </div>
                    </div>
                </div>
            </main>
            <footer className='center mt-6'>
                {userId ?
                    (
                        <>
                            {post.scholarshipsItems ?
                                <>
                                    <div
                                        className={`header-Connect-btn py-3 px-4 ${post.scholarshipsItems.assigned ? 'w-140px' : 'w-160px'} center bold fs-13 cursor`}
                                        data-bs-toggle='modal'
                                        data-bs-target={`#SellMonster${post?.id}`}
                                    >
                                        {post.scholarshipsItems.assigned ? 'View Scholar' : 'View Request'}
                                    </div>
                                    <div className='modal fade' id={`SellMonster${post?.id}`} tabIndex='-1' aria-labelledby='SellMonsterLabel' aria-hidden='true' >
                                        <div className='modal-dialog modal-lg'>
                                            <div style={{ padding: "35px" }} className='instructionsBoard modal-content py-3 bg-dark text-white shadow-lg'>

                                                <div className='modal-header p-4 border-bottom-0' style={{ border: "none" }}> <h3 style={{ color: "black" }}> Scholar DearMonster </h3>
                                                </div>
                                                <div className='modal-body p-4'>
                                                    <p className='mb-4' style={{ fontSize: "17px", fontWeight: "400", color: "black" }}>

                                                    </p>
                                                    <div className='align-items-center d-flex justify-content-between mb-4' >
                                                        <div> <h4 style={{ color: "black", fontSize: "15px" }}>Scholar Address</h4> </div>
                                                        <div className='d-flex align-items-center w-60 text-black'>
                                                            {post.scholarshipsItems.scholarWallet}
                                                        </div>

                                                    </div>
                                                    <div className='align-items-center d-flex justify-content-between mb-4' >
                                                        <div> <h4 style={{ color: "black", fontSize: "15px" }}>Scholar Name</h4> </div>
                                                        <div className='d-flex align-items-center w-60 text-black'>
                                                            {post.scholarshipsItems.scholarName}
                                                        </div>

                                                    </div>
                                                    <div className='align-items-center d-flex justify-content-between mb-4' >
                                                        <div> <h4 style={{ color: "black", fontSize: "15px" }}>Manager Name</h4> </div>
                                                        <div className='d-flex align-items-center w-60 text-black'>
                                                            {post.scholarshipsItems.managerName}
                                                        </div>

                                                    </div>
                                                    <div className='align-items-center d-flex justify-content-between mb-4' >
                                                        <div> <h4 style={{ color: "black", fontSize: "15px" }}>profitToManager</h4> </div>
                                                        <div className='d-flex align-items-center w-60 text-black'>
                                                            {post.scholarshipsItems.profitShare.Manager_Share}
                                                        </div>

                                                    </div>
                                                    <div className='align-items-center d-flex justify-content-between mb-4' >
                                                        <div> <h4 style={{ color: "black", fontSize: "15px" }}>profitToScholar</h4> </div>
                                                        <div className='d-flex align-items-center w-60 text-black'>
                                                            {post.scholarshipsItems.profitShare.Scholar_Share}
                                                        </div>

                                                    </div>
                                                    <div className='align-items-center d-flex justify-content-between mb-4' >
                                                        <div> <h4 style={{ color: "black", fontSize: "15px" }}>readMe</h4> </div>
                                                        <div className='d-flex align-items-center w-60 text-black'>
                                                            {post.scholarshipsItems.readMe}
                                                        </div>

                                                    </div>

                                                </div>
                                                <div className='modal-footer border-top-0 mb-5'>
                                                    {
                                                        !post.scholarshipsItems.assigned ?
                                                        
                                                            <div className='header-Connect-btn h-40px center w-100px px-2 bold cursor' 
                                                            onClick={() => acceptScholarRequest(post)}
                                                            data-bs-dismiss='modal'
                                                            >
                                                                Accept Request 
                                                            </div>
                                                            :
                                                            <div className='header-Connect-btn h-40px center w-100px px-2 bold cursor' 
                                                            onClick={() => revokeFunction(post)}
                                                            data-bs-dismiss='modal'
                                                            >
                                                                Revoke
                                                            </div>
                                                    }
                                                    <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                                :
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
