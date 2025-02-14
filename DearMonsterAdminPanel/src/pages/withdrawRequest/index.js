import React, { useState, useEffect } from 'react'
import "../../App.css";
import { getWithdrawRequest, getWithdrawRequestByWallet, markResolved } from '../../redux/withdrawRequest/action';
import { connect } from 'react-redux';
import { Modal, Button, Spinner } from "react-bootstrap"
import { usePagination } from '../../hooks/userPagination';
function WithdrawRequest(props) {
    const [show, setShow] = useState({ selectedRequest: '', isShow: false })
    const [transactionHash, setTransactionHash] = useState('')
    const [walletAddress, setWalletAddress] = useState('')
    const [data, setData] = useState([])
    const [limit] = useState(30);
    const [skip, setSkip] = useState(0);
    const [searchLimit] = useState(30);
    const [searchSkip, setSearchSkip] = useState(0);
    const [filteredData, setFilteredData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        props.getWithdrawRequest(limit, skip)
    }, [skip, limit])

    useEffect(() => {
        if (walletAddress != '') {
            props.getWithdrawRequestByWallet(walletAddress, searchLimit, searchSkip)
        }
    }, [searchSkip, searchLimit])

    useEffect(() => {

        if (walletAddress != '') {
            setFilteredData(props.withdrawRequest.withdrawRequests)
        } else {
            setFilteredData(null)
            setData(props.withdrawRequest.withdrawRequests)
        }

    }, [props, searchSkip, searchLimit])

    useEffect(() => {
        if (data.length) {
            setLoading(false)
        }
    }, [data])

    const nextPage = () => {
        setSkip(skip + limit)
    }

    const previousPage = () => {
        setSkip(skip - limit)
    }

    const nextSearchPage = () => {
        setSearchSkip(searchSkip + searchLimit)
    }

    const previousSearchPage = () => {
        setSearchSkip(searchSkip - searchLimit)
    }


    const handleClose = () => {
        setShow(false)
        setTransactionHash('')
    }
    const handleMark = () => {
        if (transactionHash != '') {
            if (/^0x([A-Fa-f0-9]{64})$/.test(transactionHash)) {
                props.markResolved(show.selectedRequest, transactionHash)
                setShow(false)
                setTransactionHash('')
            }
            else {
                alert('Please enter a valid transaction hash')
            }
        }
        else {
            props.markResolved(show.selectedRequest, transactionHash)
            setShow(false)
            setTransactionHash('')
        }
    }

    const markResolved = (data) => {
        setShow({ selectedRequest: data._id, isShow: true })
    }

    const handleChange = (e) => {
        setTransactionHash(e.target.value)
    }

    const onChangeWallet = (e) => {
        setWalletAddress(e.target.value)
        if (e.target.value != '') {
            props.getWithdrawRequestByWallet(e.target.value, limit, skip)
        } else {
            props.getWithdrawRequest(limit, skip)

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
                                    <th>Requester Address</th>
                                    <th>Type</th>
                                    <th>Amount</th>
                                    <th>Create Time</th>
                                    <th>Resolve Time</th>
                                    <th>Resolved</th>
                                    <th>Mark Resolved</th>
                                </tr>
                            </thead>

                            <tbody className="table__body">
                                {loading ? <Spinner animation="border" /> :
                                    filteredData ?
                                        <>
                                            {filteredData?.length === 0 ? (
                                                <div className='text-center'>
                                                    <h3>{'No Data'}</h3>
                                                </div>
                                            ) : (
                                                filteredData.length > 0 ? filteredData.map((data, index) => {
                                                    return (
                                                        <tr key={(index + 1)}>
                                                            <td>{`${data.requesterAddress.substring(0, 4)}...${data.requesterAddress.slice(-4)}`}</td>
                                                            <td>{data.type}</td>
                                                            <td>{`${data.amount}`}</td>
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
                                                data.length > 0 ? data.map((data, index) => {
                                                    return (
                                                        <tr key={(index + 1)}>
                                                            <td>{data.requesterAddress}</td>
                                                            <td>{data.type}</td>
                                                            <td>{`${data.amount}`}</td>
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
                        {filteredData && filteredData?.length == 0 ? (
                            ''
                        ) : (filteredData && filteredData.length) ?

                            <div className="row">
                                <div className='col-md-4'>
                                    {(searchSkip / limit) + 1 != 1 &&
                                        <img
                                            src='/assets/imgs/ArrowLeft.png'
                                            style={{ cursor: 'pointer' }}
                                            onClick={previousSearchPage}
                                        />}
                                </div>
                                <div className='col-md-4'>
                                    <p className='col-md-2'>
                                        {(searchSkip / limit) + 1}/{Math.ceil(props.withdrawRequest.count / limit)}
                                    </p>
                                </div>
                                <div className='col-md-4'>
                                    {(searchSkip / limit) + 1 != Math.ceil(props.withdrawRequest.count / limit) &&
                                        <img src='/assets/imgs/ArrowRight.png'
                                            style={{ cursor: 'pointer' }}
                                            className='col-md-4' onClick={nextSearchPage} />
                                    }

                                </div>

                            </div> : data?.length == 0 ? '' : (
                                <div className="row">
                                    <div className='col-md-4'>
                                        {(skip / limit) + 1 != 1 &&
                                            <img
                                                src='/assets/imgs/ArrowLeft.png'
                                                style={{ cursor: 'pointer' }}
                                                onClick={previousPage}
                                            />}
                                    </div>
                                    <div className='col-md-4'>
                                        <p className='col-md-2'>
                                            {(skip / limit) + 1}/{Math.ceil(props.withdrawRequest.count / limit)}
                                        </p>
                                    </div>
                                    <div className='col-md-4'>
                                        {(skip / limit) + 1 != Math.ceil(props.withdrawRequest.count / limit) &&
                                            <img src='/assets/imgs/ArrowRight.png'
                                                style={{ cursor: 'pointer' }}
                                                className='col-md-4' onClick={nextPage} />
                                        }

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

export default connect(mapStateToProps, { getWithdrawRequest, getWithdrawRequestByWallet, markResolved })(WithdrawRequest); 