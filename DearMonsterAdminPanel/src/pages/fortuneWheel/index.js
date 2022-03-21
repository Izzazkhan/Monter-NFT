import React, { useState, useEffect } from "react"
import "../../App.css";
import { getFortuneWheel, deleteFortuneWheel } from '../../redux/fortuneWheel/action';
import { connect } from 'react-redux';
import { Spinner } from "react-bootstrap"

function FortuneWheel(props) {

    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])

    useEffect(() => {
        props.getFortuneWheel()
    }, [])

    useEffect(() => {
        setLoading(true)
        setData(props.fortuneWheel.fortuneWheel)
    }, [props])

    useEffect(() => {
        if(data.length) {
            setLoading(false)
        }
    }, [data])

    const editDetails = (data) => {
        props.history.push('/fortune-wheel/edit', { data })
    }

    const deleteFortuneWheel = (id) => {
        // clearData();
        // if (window.confirm("Are you sure?")) {
        //     props.deleteFortuneWheel(id, JSON.parse(localStorage.getItem('token')));

        // }
        alert('Can not delete')
    }
    
    return (
        <>
            <div className="col-lg-9 col-md-8">
                <div className="content-wrapper">
                    <div className="content-box">
                        <h3>Fortune Wheel</h3>
                        {!data.length &&
                            <button className="btn-default" onClick={() => props.history.push('/fortune-wheel/create')}>ADD New</button>
                        }
                        <table className="table">
                            <thead className="table__head">
                                <tr>
                                    <th>Name</th>
                                    <th>Is Active</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody className="table__body">

                                {loading ?  <Spinner animation="border" />
                                    : data.length ? data.map((data, index) => {
                                        return <tr key={(index + 1)}>
                                            <td>{data.wheelName}</td>
                                            <td>{`${data.isActive}`}</td>
                                            <td><button onClick={() => editDetails(data)}>EDIT</button>
                                                <button onClick={() => deleteFortuneWheel(data._id)}>DELETE</button>
                                            </td>
                                        </tr>
                                    }) : <div className='text-center'>
                                    <h3>{'No Data'}</h3>
                                </div>}

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = state => ({
    fortuneWheel: state.FortuneWheelReducer
});

export default connect(mapStateToProps, { getFortuneWheel, deleteFortuneWheel })(FortuneWheel);

