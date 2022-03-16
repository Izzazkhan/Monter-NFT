
import React, { useState, useEffect } from "react"
import "../../App.css";
import { getCrystalShard, addCrystalShard, editCrystalShard, deleteCrystalShard } from '../../redux/crystalShard/action';
import { connect } from 'react-redux';
import {uploadsUrl} from '../../utilities/constant'
function CrystalShardForm(props) {
    const [state, setState] = useState({
        name: '',
        description: ''
    })
    const [imagePreview, setImagePreview] = useState('')
    const [imageUpload, setImageUpload] = useState('')
    const [crystalImage, setCrystalImage] = useState('')

    useEffect(() => {
        if (props.location.state !== undefined) {
            const propsData = props.location.state.data

            setState({
                ...state,
                _id: propsData._id,
                name: propsData['name'],
                description: propsData['description']
            })
            if(props.location.state.data.crystalImage) {
                setCrystalImage(props.location.state.data.crystalImage.split('\\')[1])
            }
        }
    }, [])

    const onImageUpload = (event) => {
        event.preventDefault()
        var file = event.target.files[0];
        setCrystalImage(file.name)
        setImageUpload(file)
        const imageReader = new FileReader()
        imageReader.readAsDataURL(file);
        imageReader.onloadend = () => {
            setImagePreview([imageReader.result])
        }
    }

    const submitData = () => {
        if (!state._id) {
            props.addCrystalShard({
                crystalImage,
                ...state
            }, imageUpload, JSON.parse(localStorage.getItem('token')))
            // props.history.push('/crystal-shard')
        } else if (state._id) {
            props.editCrystalShard({crystalImage, ...state}, imageUpload, JSON.parse(localStorage.getItem('token')))
            // props.history.push('/crystal-shard')
        } else {
            alert('Enter Monster Details.');
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
            name: '',
            description: ''
        })
        setCrystalImage('')
    }

    return (
        <>
            <div className="col-lg-9 col-md-8">
                <div className="content-wrapper">
                    <div className="content-box">
                        <h3>Elemental Crystal Shards</h3>
                        <div className="row">
                            {InputField}
                        </div>

                        <div className="row">
                            <div className="form-group col-md-6">
                                <label className="control-label">Item Image</label>
                                <input type="file" required="required" className="form-control" onChange={onImageUpload} />
                                {imagePreview != '' ? 
                                <img style={{
                                    marginTop: imagePreview && '20px',
                                    height: imagePreview && '100px'}} src={imagePreview} 
                                /> : crystalImage != '' ?
                                <img style={{
                                    marginTop: uploadsUrl + crystalImage && '20px',
                                    height: uploadsUrl + crystalImage && '100px' 
                                    }}  src={uploadsUrl + crystalImage} 
                                />
                                : undefined
                                }
                            </div>
                            {/* <button className="btn-default hvr-bounce-in" onClick={handleSubmit}>Image Upload</button> */}
                        </div>
                        <div className="row" style={{ justifyContent: 'center', width: '200px' }}>
                            {state._id ? <button className="btn-default hvr-bounce-in" onClick={submitData}>UPDATE</button> :
                                <button className="btn-default hvr-bounce-in" onClick={submitData}>Submit</button>}
                        </div>
                        <div className="row" style={{ justifyContent: 'center', width: '200px' }}>
                            <button className="btn-default hvr-bounce-in" onClick={clearData}>CLEAR</button>
                        </div>
                        <br />
                    </div>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = state => ({
    crystalShard: state
});

export default connect(mapStateToProps, { getCrystalShard, addCrystalShard, editCrystalShard, deleteCrystalShard })(CrystalShardForm); 