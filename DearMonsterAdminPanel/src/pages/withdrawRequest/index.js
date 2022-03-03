import React, {useState, useEffect} from 'react'
import "../../App.css";
import { getWithdrawRequest, markResolved } from '../../redux/withdrawRequest/action';
import { connect } from 'react-redux';
import { Modal, Button, Spinner } from "react-bootstrap"
import { usePagination } from '../../hooks/userPagination';
function WithdrawRequest(props) {
    const [show, setShow] = useState({selectedRequest: '', type: '', isShow: false})
    const [transactionHash, setTransactionHash] = useState('')
    const [walletAddress, setWalletAddress] = useState('')
	const [data, setData] = useState([])
	const [filteredData, setFilteredData] = useState(null)
	const [filterObject, setFilterObject] = useState({})
	const [loading, setLoading] = useState(true)

	const { pageData, currentPage, previousPage, nextPage, totalPages, doPagination } = usePagination(filteredData != null ? filteredData : data, 30)

    useEffect(() => {
        props.getWithdrawRequest()
    }, [])

    useEffect(() => {
        setData(props.withdrawRequest.withdrawRequests)
        doPagination(props.withdrawRequest.withdrawRequests)
    }, [props])

    useEffect(() => {
        if(data.length) {
            setLoading(false)
        }
    }, [data])

    useEffect(() => {
        setLoading(true)
		if (Object.keys(filterObject).length > 0) {
			let localFilterData = []
			let filterApplied = false

			if (filterObject.searchedWallet && filterObject.searchedWallet != '') {
				let searchDataLocal
				if (filterApplied) {
					searchDataLocal = localFilterData.filter((element) => element.requesterAddress == filterObject.searchedWallet)
				} else {
					searchDataLocal = data.filter((element) => element.requesterAddress == filterObject.searchedWallet)
					filterApplied = true
				}
				localFilterData = searchDataLocal
			}

			if (filterApplied) {
				setFilteredData(localFilterData)
				doPagination(localFilterData)
                setLoading(false)
			}
		} else {
			if (data && data.length > 0) {
				setFilteredData(data)
				doPagination(data)
                setLoading(false)
			}
		}
	}, [filterObject])

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
        const searchedWallet = e.target.value
        if (searchedWallet != '') {
			setFilterObject({ ...filterObject, searchedWallet })
		} else {
			let tempObj = { ...filterObject }
			delete tempObj.searchedWallet

			setFilterObject(tempObj)
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
                            { loading ?  <Spinner animation="border" /> :
								filteredData ?
									<>
										{filteredData?.length === 0 ? (
											<div className='text-center'>
												<h3>{'No Data'}</h3>
											</div>
										) : (
											pageData.length > 0 ? pageData.map((data, index) => {
												return (
													<tr key={(index + 1)}>
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
												);
											}) : ""
										)}
									</>
									:
									<>
										{data?.length === 0 ? (
											<div className='text-center'>
												<h3>{'No Data'}</h3>
											</div>
										) : (
											pageData.length > 0 ? pageData.map((data, index) => {
												return (
													<tr key={(index + 1)}>
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
												);
											}) : ""
										)}
									</>

							}
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