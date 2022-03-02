
import React, {useState, useEffect} from 'react'
import "../../App.css";
import { getWithdrawRequest, markResolved } from '../../redux/withdrawRequest/action';
import { connect } from 'react-redux';
import { Modal, Button } from "react-bootstrap"
import { usePagination } from '../../hooks/userPagination';

function WithdrawRequest(props) {
    const [show, setShow] = useState({selectedRequest: '', type: '', isShow: false})
    const [transactionHash, setTransactionHash] = useState('')
    const [walletAddress, setWalletAddress] = useState('')

	const { pageData, currentPage, previousPage, nextPage, totalPages, doPagination } = usePagination(props.withdrawRequest.withdrawRequests, 5)

    useEffect(() => {
        props.getWithdrawRequest()
    }, [])

    useEffect(() => {
		doPagination(props.withdrawRequest.withdrawRequests)
    }, [props])

    const handleClose = () => {
        setShow(false)
        setTransactionHash('')
    }
    const handleMark = () => {
        if(transactionHash != ''){
            if(/^0x([A-Fa-f0-9]{64})$/.test(transactionHash)){
                props.markResolved(show.selectedRequest, show.type, transactionHash)
                setShow(false)
                setTransactionHash('')
            }
            else {
                alert('Please enter a valid transaction hash')
            }
        }
        else {
            props.markResolved(show.selectedRequest, show.type, transactionHash)
            setShow(false)
            setTransactionHash('')
        }   
    }

    const markResolved = (data) => {
        setShow({selectedRequest: data._id, type: data.type, isShow: true})
    }

    const handleChange = (e) => {
        setTransactionHash(e.target.value)
    }

    const onChangeWallet = (e) => {
        setWalletAddress(e.target.value)
        const filteredData = props.withdrawRequest.withdrawRequests.filter(wallet => wallet.requesterAddress === e.target.value)
        if(filteredData.length){
            doPagination(filteredData)
        }
        else {
            doPagination(props.withdrawRequest.withdrawRequests)
        }
    }

    const formatDate = (date) => {
        const formatedData = new Date(date);
    
        let minutes = "";
    
        if (formatedData.getHours().toString().length === 1) {
          minutes = "0" + formatedData.getHours();
        } else {
          minutes = formatedData.getHours();
        }
    
        return (
          formatedData.getDate()
            .toString()
            .padStart(2, "0") +
          "-" +
          (formatedData.getMonth() + 1).toString().padStart(2, "0") +
          "-" +
          formatedData.getFullYear() +
          " " +
          minutes +
          ":" +
          ("00" + formatedData.getMinutes()).slice(-2)
        );
      };

    

    return (
        <>
            <div className="col-lg-9 col-md-8">
                <div className="content-wrapper">
                    <div className="content-box">
                        <h3>Withdraw Requests</h3>
                        <div className="row">
                            <div className={`col-md-12`}>
                            <label className="control-label">{`Wallet Address`}</label>
                            <input type="text" required="required" className="form-control" onChange={onChangeWallet}
                            name={'walletAddress'} value={walletAddress}
                            placeholder={`Enter Wallet Address`}
                            />
                            </div>
                        </div>
                        <table className="table">
                            <thead className="table__head">
                                <tr>
                                    <th>Amount</th>
                                    <th>Requester Address</th>
                                    <th>Create Time</th>
                                    <th>Resolved Time</th>
                                    <th>Resolved</th>
                                    <th>Mark Resolved</th>
                                </tr>
                            </thead>

                            <tbody className="table__body">

                                {pageData.length
                                    && pageData.map((data, index) => {
                                        return <tr key={(index + 1)}>
                                            <td>{`${data.amount}`}</td>
                                            <td>{data.requesterAddress}</td>
                                            <td>{formatDate(data.createdAt)}</td>
                                            <td>{formatDate(data.updatedAt)}</td>
                                            <td>{data.isResolved ? 'Yes' : 'No'}</td>
                                            
                                            {data.isResolved
                                            ?
                                            <td>
                                                <button>Marked</button>
                                            </td>
                                            :
                                            <td>
                                            <button onClick={() => markResolved(data)}>Mark</button>
                                        </td>}
                                        </tr>
                                    })}

                            </tbody>
                        </table>
                        {pageData?.length == 0 ? (
							''
						) : (
                            <div className="row">
                                <div className='col-md-4'>
                                <img
									src='/assets/imgs/ArrowLeft.png'
                                    style={{cursor: 'pointer'}}
									onClick={previousPage}
								/>
                                </div>
                                <div className='col-md-4'>
                                <p className='col-md-2'>
									{currentPage}/{totalPages}
								</p>
                                </div>
                                <div className='col-md-4'>
                                <img src='/assets/imgs/ArrowRight.png' 
                                    style={{cursor: 'pointer'}}
                                    className='col-md-4' onClick={nextPage} />
                                </div>
                                
                                </div>
							
						)}
                    </div>
                </div>
            </div>


            <Modal show={show.isShow} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                    <Modal.Body>
                        <div className="form-group col-md-12 mb-4">
                                <label className="control-label">{'Transaction Hash'}</label>
                                <input type="text" required="required" className="form-control" onChange={handleChange}
                                    name={'transactionHash'} value={transactionHash}
                                    placeholder={`Enter Transaction Hash`}
                                />
                        </div>
                    </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleMark}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

const mapStateToProps = state => ({
    withdrawRequest: state.WithdrawRequestReducer
});

export default connect(mapStateToProps, { getWithdrawRequest, markResolved })(WithdrawRequest); 