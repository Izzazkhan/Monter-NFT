
import React, { useState, useEffect } from "react"
import "../../App.css";
import { getCrystalShard, addCrystalShard, editCrystalShard, deleteCrystalShard } from '../../redux/crystalShard/action';
import { getShardType } from '../../redux/shardType/action';
import { connect } from 'react-redux';
import {uploadsUrl} from '../../utilities/constant'
function CrystalShardForm(props) {
    const [state, setState] = useState({
        shardName: '',
        shardDescription: ''
    })
    const [shardTypeId, setShardTypeId] = useState('')
    const [shardType, setShardType] = useState([])

    const [limit, setLimit] = useState(30);
    const [skip, setSkip] = useState(0);

    useEffect(() => {
        props.getShardType(limit, skip)
    }, [limit, skip])

    useEffect(() => {
        if (props.location.state !== undefined) {
            const propsData = props.location.state.data
            setState({
                ...state,
                _id: propsData._id,
                shardName: propsData['shardName'],
                shardDescription: propsData['shardDescription']
            })
            setShardTypeId(propsData['shardTypeId'])
        }
    }, [])
    useEffect(() => {
        if(props.shardType.shardType && props.shardType.shardType.length) {
            if(props.location.state == undefined) {
                setShardTypeId(props.shardType.shardType[0]._id)
            }
            setShardType(props.shardType.shardType)
        }
    }, [props, shardType])

    const submitData = () => {
        if (!state._id) {
            props.addCrystalShard({ shardType: shardTypeId, ...state }, JSON.parse(localStorage.getItem('token')))
            props.history.push('/crystal-shard')
        } else if (state._id) {
            props.editCrystalShard({ shardType: shardTypeId, ...state}, JSON.parse(localStorage.getItem('token')))
            props.history.push('/crystal-shard')
        } else {
            alert('Enter Monster Details.');
        }
    }

    const handleChange = (e) => {
        if(e.target.name === 'shardType') {
            setShardTypeId(e.target.value)
        } else {
            setState({ ...state, [e.target.name]: e.target.value })
        }
    }

    const InputField = Object.entries(state).map((item, i) => {
        const field = item[0]
        const value = item[1]
        if (field !== '_id') {
            return (
                <div className={`form-group ${field === 'message' ? 'col-md-12' : 'col-md-6'}`} key={i}>
                    <label className="control-label">{`${field}`}</label>
                    <input type="text" required="required" className="form-control" onChange={handleChange}
                        name={field} value={value}
                        placeholder={`Enter ${field}`}
                    />
                </div>
            )
        }
    })

    return (
        <>
            <div className="col-lg-9 col-md-8">
                <div className="content-wrapper">
                    <div className="content-box">
                        <h3>Shards</h3>
                        <div className="row">
                            {InputField}
                        </div>
                        <div className="form-group col-md-3 mb-3">
                            <label className="control-label">{'Shard Type'}</label>
                            <select name='shardType' className='form-control  w-100px' onChange={handleChange} value={shardTypeId}>
                            {shardType.map(item => {
                                return (
                                    <option value={item._id}>{item.typeName}</option>
                                )
                            })}
                            </select>
                        </div>

                        <div className="row" style={{ justifyContent: 'center', width: '200px' }}>
                            {state._id ? <button className="btn-default hvr-bounce-in" onClick={submitData}>UPDATE</button> :
                                <button className="btn-default hvr-bounce-in" onClick={submitData}>Submit</button>}
                        </div>
                        <br />
                    </div>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = state => ({
    crystalShard: state,
    shardType: state.ShardTypeReducer
});

export default connect(mapStateToProps, { getCrystalShard, addCrystalShard, editCrystalShard, deleteCrystalShard, getShardType })(CrystalShardForm); 