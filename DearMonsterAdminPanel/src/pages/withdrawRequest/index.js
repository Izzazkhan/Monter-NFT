
import React, { useEffect } from "react"
import "../../App.css";
import { getWithdrawRequest, markResolved } from '../../redux/withdrawRequest/action';
import { connect } from 'react-redux';

function WithdrawRequest(props) {

    useEffect(() => {
        props.getWithdrawRequest()
    }, [])


    const markResolved = (id) => {
        if (window.confirm("Are you sure?")) {
            props.markResolved(id)
        }
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
        </>
    )
}

const mapStateToProps = state => ({
    withdrawRequest: state.WithdrawRequestReducer
});

export default connect(mapStateToProps, { getWithdrawRequest, markResolved })(WithdrawRequest); 