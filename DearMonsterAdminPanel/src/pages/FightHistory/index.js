
import React, {useState, useEffect} from 'react'
import "../../App.css";
import { getWithdrawRequest } from '../../redux/fightHistory/action';
import { connect } from 'react-redux';
import { Modal, Button } from "react-bootstrap"
import { usePagination } from '../../hooks/userPagination';

function WithdrawRequest(props) {

    useEffect(() => {
        props.getWithdrawRequest()
    }, [])


    

    return (
        <>
            <div className="col-lg-9 col-md-8">
                <div className="content-wrapper">
                    <div className="content-box">
                        <h3>Fight History</h3>
                        <table className="table">
                            <thead className="table__head">
                                <tr>
                                    <th>Monster</th>
                                    <th>Minion</th>
                                    <th>Type</th>
                                    <th>Fight Status</th>
                                </tr>
                            </thead>

                            <tbody className="table__body">

                                {props.fightHistory.fightHistory.length
                                    && props.fightHistory.fightHistory.map((data, index) => {
                                        return <tr key={(index + 1)}>
                                            <td>{`${data.monster.title}`}</td>
                                            <td>{data.minion.title}</td>
                                            <td>{(data.type)}</td>
                                            <td>{(data.fightStatus)}</td>
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
    fightHistory: state.FightHistoryReducer
});

export default connect(mapStateToProps, { getWithdrawRequest })(WithdrawRequest); 