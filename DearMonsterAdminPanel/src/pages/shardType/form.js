
import React, { useState, useEffect } from "react"
import "../../App.css";
import { addShardType, editShardType } from '../../redux/shardType/action';
import { connect } from 'react-redux';
import {uploadsUrl} from '../../utilities/constant'
function ShardTypeForm(props) {
    const [state, setState] = useState({
        typeName: ''
    })
    const [imagePreview, setImagePreview] = useState('')
    const [imageUpload, setImageUpload] = useState('')
    const [image, setImage] = useState('')

    useEffect(() => {
        if (props.location.state !== undefined) {
            const propsData = props.location.state.data
            setState({
                ...state,
                _id: propsData._id,
                typeName: propsData['typeName']
            })
            if(props.location.state.data.image) {
                setImage(props.location.state.data.image)
            }
        }
    }, [])

    const onImageUpload = (event) => {
        event.preventDefault()
        var file = event.target.files[0];
        setImage(file.name)
        setImageUpload(file)
        const imageReader = new FileReader()
        imageReader.readAsDataURL(file);
        imageReader.onloadend = () => {
            setImagePreview([imageReader.result])
        }
    }

    const submitData = () => {
        if (!state._id) {
            props.addShardType({
                image,
                ...state
            }, imageUpload, JSON.parse(localStorage.getItem('token')))
            props.history.push('/shard-type')
        } else if (state._id) {
            props.editShardType({image, ...state}, imageUpload, JSON.parse(localStorage.getItem('token')))
            props.history.push('/shard-type')
        } else {
            alert('Enter Details.');
        }
        clearData()
    }

    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value })
    }

    const InputField = Object.entries(state).map((item, i) => {
        const field = item[0]
        const value = item[1]
        if (field !== '_id') {
            return (
                <div className={`form-group ${field === 'message' ? 'col-md-12' : 'col-md-6'}`} key={i}>
                    <label className="control-label">{`${field.toUpperCase()}`}</label>
                    <input type="text" required="required" className="form-control" onChange={handleChange}
                        name={field} value={value}
                        placeholder={`Enter ${field}`}
                    />
                </div>
            )
        }
    })

    const clearData = () => {
        setState({
            typeName: ''
        })
        setImage('')
    }

    return (
        <>
            <div className="col-lg-9 col-md-8">
                <div className="content-wrapper">
                    <div className="content-box">
                        <h3>Shard Type</h3>
                        {/* <div className="row">
                            {InputField}
                        </div> */}

                        <div className="row">
                            <div className="form-group col-md-6">
                                {InputField}
                            </div>
                            <div className="form-group col-md-6">
                                <label className="control-label">Item Image</label>
                                <input type="file" required="required" className="form-control" onChange={onImageUpload} />
                                {imagePreview != '' ? 
                                <img style={{
                                    marginTop: imagePreview && '20px',
                                    height: imagePreview && '100px'}} src={imagePreview} 
                                /> : image != '' ?
                                <img style={{
                                    marginTop: uploadsUrl + image && '20px',
                                    height: uploadsUrl + image && '100px' 
                                    }}  src={uploadsUrl + image} 
                                />
                                : undefined
                                }
                            </div>
                            {/* <button className="btn-default hvr-bounce-in" onClick={handleSubmit}>Image Upload</button> */}
                        </div>

                        <div className="row" >
                            <div className="col-md-6">{state._id ? <button className="btn-default hvr-bounce-in" onClick={submitData}>UPDATE</button> :
                                <button className="btn-default hvr-bounce-in" onClick={submitData}>Submit</button>}</div>
                        </div>
                        <br />
                    </div>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = state => ({
    shardType: state
});

export default connect(mapStateToProps, { addShardType, editShardType })(ShardTypeForm); 