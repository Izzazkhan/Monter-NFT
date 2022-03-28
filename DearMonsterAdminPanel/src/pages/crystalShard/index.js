
import React, { useState, useEffect } from "react"
import "../../App.css";
import { getCrystalShard, addCrystalShard, editCrystalShard, deleteCrystalShard } from '../../redux/crystalShard/action';
import { connect } from 'react-redux';
import { Modal, Button, Spinner } from "react-bootstrap"
import {uploadsUrl} from '../../utilities/constant'

function CrystalShard(props) {

    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const [limit, setLimit] = useState(30);
    const [skip, setSkip] = useState(0);

    useEffect(() => {
        props.getCrystalShard(limit, skip)
    }, [limit, skip])

    useEffect(() => {
        setLoading(true)
        setData(props.crystalShard.crystalShard)
    }, [props])

    useEffect(() => {
        if(data) {
            if(data.length) {
                setLoading(false)
            }
        }
    }, [data])

    // console.log('data', data)


    const editDetails = (data) => {
        props.history.push('/crystal-shard/edit', { data })
    }

    const deleteCrystalShard = (id) => {
        // clearData();
        if (window.confirm("Are you sure?")) {
            props.deleteCrystalShard(id, JSON.parse(localStorage.getItem('token')));

        }
        // alert('can not delete')
    }
    
    return (
        <>
            <div className="col-lg-9 col-md-8">
                <div className="content-wrapper">
                    <div className="content-box">
                        <h3>Elemental Crystal Shards</h3>
                        {/* {!data.length && */}
                            <button className="btn-default" onClick={() => props.history.push('/crystal-shard/create')}>ADD New</button>
                        {/* } */}
                        <table className="table">
                            <thead className="table__head">
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Image</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody className="table__body">

                                {loading ?  <Spinner animation="border" />
                                    : data.length ? data.map((data, index) => {
                                        return <tr key={(index + 1)}>
                                            <td>{data.name}</td>
                                            <td>{data.description}</td>
                                            <td>{data.crystalImage ? <img style={{
                                    height: uploadsUrl + data.crystalImage.split('\\')[1] && '60px',
                                    width: uploadsUrl + data.crystalImage.split('\\')[1] && '90px' 
                                    }}  src={uploadsUrl + data.crystalImage.split('\\')[1]} 
                                /> : 'No Image' }</td>
                                            <td><button onClick={() => editDetails(data)}>EDIT</button>
                                                <button onClick={() => deleteCrystalShard(data._id)}>DELETE</button>
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
    crystalShard: state.CrystalShardReducer
});

export default connect(mapStateToProps, { getCrystalShard, addCrystalShard, editCrystalShard, deleteCrystalShard })(CrystalShard);

