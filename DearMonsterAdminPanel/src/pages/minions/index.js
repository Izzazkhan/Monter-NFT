
import React, { useState, useEffect } from "react"
import "../../App.css";
import { getMinions, addMinions, editMinions, deleteMinions } from '../../redux/minions/action';
import { connect } from 'react-redux';
import { useSelector, useDispatch } from 'react-redux'
import { Modal, Button, Spinner } from "react-bootstrap"

function Minions(props) {
    
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])

    useEffect(() => {
        props.getMinions(JSON.parse(localStorage.getItem('token')))
    }, [])

    useEffect(() => {
        setLoading(true)
        setData(props.minions.minions)
    }, [props])

    useEffect(() => {
        if(data.length) {
            setLoading(false)
        }
    }, [data])


    const editDetails = (data) => {
        props.history.push('/minions/edit', { data })
    }

    const deleteMinions = (id) => {
        if (window.confirm("Are you sure?")) {
            props.deleteMinions(id, JSON.parse(localStorage.getItem('token')))
        }
    }

    return (
        <>
            <div className="col-lg-9 col-md-8 minion_edit_button">
                <div className="content-wrapper">
                    <div className="content-box">
                        <h3>Minions Profile</h3>
                        <button className="btn-default" onClick={() => props.history.push('/minions/create')}>ADD New</button>
                        <table className="table">
                            <thead className="table__head">
                                <tr>
                                    {/* <th>ID</th> */}
                                    <th>Title</th>
                                    {/* <th>Image</th> */}
                                    <th>Rating</th>
                                    <th>Total Rating</th>
                                    <th>Experience Gain</th>
                                    <th>Experience Lose</th>
                                    {/* <th>Reward Estimated</th> */}
                                    <th>Win Rate</th>
                                    <th>Action(s)</th>
                                </tr>
                            </thead>

                            <tbody className="table__body">

                                {loading ?  <Spinner animation="border" />
                                    : data.length
                                    ? data.map((data, index) => {
                                        return <tr key={(index + 1)}>
                                            {/* <td>{(index + 1)}</td> */}
                                            {/* <td>{data._id}</td> */}
                                            <td>{data.title}</td>
                                            {/* <td>{data.img}</td> */}
                                            <td>{data.rating}</td>
                                            <td>{data.totalRating}</td>
                                            <td>{data.values.Exp_Gain}</td>
                                            <td>{data.values.Lose_Exp_Gain}</td>
                                            {/* <td>{data.values.Reward_Estimated}</td> */}
                                            <td>{data.values.Win_Rate}</td>

                                            <td><button onClick={() => editDetails(data)}>EDIT</button>
                                                <button onClick={() => deleteMinions(data._id)}>DELETE</button>
                                            </td>
                                        </tr>
                                    }) : <div className='text-center'>
                                            <h3>{'No Data'}</h3>
                                        </div>
                                    }

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = state => ({
    minions: state.MinionsReducer
});

export default connect(mapStateToProps, { getMinions, addMinions, editMinions, deleteMinions })(Minions); 