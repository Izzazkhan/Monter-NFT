
import React, {useState, useEffect} from 'react'
import "../../App.css";
import { getWithdrawRequest, markResolved } from '../../redux/withdrawRequest/action';
import { connect } from 'react-redux';
import { Modal, Button } from "react-bootstrap"

function WithdrawRequest(props) {
    const [show, setShow] = useState({selectedRequest: '', isShow: false})
    const [transactionHash, setTransactionHash] = useState('')


    useEffect(() => {
        props.getWithdrawRequest()
    }, [])

    const handleClose = () => {
        setShow(false)
        setTransactionHash('')
    }
    const handleMark = () => {
        props.markResolved(show.selectedRequest, transactionHash)
    }

    const markResolved = (id) => {
        setShow({selectedRequest: id, isShow: true})
    }

    const handleChange = (e) => {
        setTransactionHash(e.target.value)
    }

    return (
        <>
            <div className="col-lg-9 col-md-8">
                <div className="content-wrapper">
                    <div className="content-box">
                        <h3>Withdraw Requests</h3>
                        {/* <button className="btn-default" onClick={() => props.history.push('/minions/create')}>ADD New</button> */}
                        <table className="table">
                            <thead className="table__head">
                                <tr>
                                    <th>Amount</th>
                                    <th>Requester Address</th>
                                    <th>Is Resolved</th>
                                    <th>Mark Resolved</th>
                                </tr>
                            </thead>

                            <tbody className="table__body">

                                {props.withdrawRequest.withdrawRequests
                                    && props.withdrawRequest.withdrawRequests.map((data, index) => {
                                        return <tr key={(index + 1)}>
                                            <td>{`${data.amount}`}</td>
                                            <td>{data.requesterAddress}</td>
                                            <td>{`${data.isResolved}`}</td>
                                            <td>
                                                <button onClick={() => markResolved(data._id)}>Mark</button>
                                            </td>
                                        </tr>
                                    })}

                            </tbody>
                        </table>
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