
import React, { useState, useEffect } from "react"
import "../../App.css";
import { getShardType, deleteShardType } from '../../redux/shardType/action';
import { connect } from 'react-redux';
import { Modal, Button, Spinner } from "react-bootstrap"
import {uploadsUrl} from '../../utilities/constant'

function ShardType(props) {

    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const [limit, setLimit] = useState(30);
    const [skip, setSkip] = useState(0);

    useEffect(() => {
        props.getShardType(limit, skip)
    }, [limit, skip])

    useEffect(() => {
        setLoading(true)
        if(props.shardType.shardType.length) {
            setData(props.shardType.shardType)
        } else {
            setLoading(false)
        }
    }, [props])

    useEffect(() => {
        if(data) {
            if(data.length) {
                setLoading(false)
            } 
        } 
    }, [data])

    const editDetails = (data) => {
        props.history.push('/shard-type/edit', { data })
    }

    const deleteShardType = (id) => {
        // clearData();
        if (window.confirm("Are you sure?")) {
            props.deleteShardType(id, JSON.parse(localStorage.getItem('token')));

        }
        // alert('can not delete')
    }
    
    return (
        <>
            <div className="col-lg-9 col-md-8">
                <div className="content-wrapper">
                    <div className="content-box">
                        <h3>Shard Type</h3>
                        {/* {!data.length && */}
                            <button className="btn-default" onClick={() => props.history.push('/shard-type/create')}>ADD New</button>
                        {/* } */}
                        <table className="table">
                            <thead className="table__head">
                                <tr>
                                    <th>Type Name</th>
                                    <th>Image</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody className="table__body">

                                {loading ?  <Spinner animation="border" />
                                    : data.length ? data.map((data, index) => {
                                        return <tr key={(index + 1)}>
                                            <td>{data.typeName}</td>
                                            <td>{data.image ? <img style={{
                                    height: uploadsUrl + data.image.split('\\')[1] && '60px',
                                    width: uploadsUrl + data.image.split('\\')[1] && '90px' 
                                    }}  src={uploadsUrl + data.image.split('\\')[1]} 
                                /> : 'No Image' }</td>
                                            <td><button onClick={() => editDetails(data)}>EDIT</button>
                                                <button onClick={() => deleteShardType(data._id)}>DELETE</button>
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
    shardType: state.ShardTypeReducer
});

export default connect(mapStateToProps, { getShardType, deleteShardType })(ShardType);

